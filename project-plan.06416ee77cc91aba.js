const rows = [
    ["design", "Conception"],
    ["supplier", "Fournisseur"],
    ["preparation", "Préparation"],
    ["integration", "Intégration"],
    ["acceptance", "Réception"],
];
// Domain graph: design forks to supplier/preparation; both constrain integration;
// acceptance waits for integration AND complete supplier delivery.
const edges = [
    ["design", "supplier"],
    ["design", "preparation"],
    ["supplier", "integration"],
    ["preparation", "integration"],
    ["integration", "acceptance"],
    ["supplier", "acceptance"],
];
const origin = 200;
const span = 720;
const dayX = (day) => origin + (Math.min(day, 80) / 80) * span;
const y = (index) => 82 + index * 58;
const number = (value) => Number(value.toFixed(3));
function validate(input) {
    const validDay = (value) => Number.isSafeInteger(value) && value >= 0 && value <= 3650;
    if (!input?.baseline || !input.forecast)
        throw new RangeError("INVALID_PROJECT_PLAN");
    for (const tasks of [input.baseline.tasks, input.forecast.tasks]) {
        if (!Array.isArray(tasks) ||
            tasks.length !== rows.length ||
            !rows.every(([id]) => tasks.filter((task) => task.id === id).length === 1) ||
            !tasks.every((task) => validDay(task.start) && validDay(task.finish) && task.finish >= task.start))
            throw new RangeError("INVALID_PROJECT_PLAN_TASKS");
    }
    if (!validDay(input.externalTargetWorkingDay) ||
        input.externalTargetWorkingDay > 80 ||
        !validDay(input.forecast.finishWorkingDay) ||
        input.forecast.finishWorkingDay !== Math.max(...input.forecast.tasks.map((task) => task.finish)))
        throw new RangeError("INVALID_PROJECT_PLAN_DATES");
    return {
        baseline: new Map(input.baseline.tasks.map((task) => [task.id, task])),
        forecast: new Map(input.forecast.tasks.map((task) => [task.id, task])),
    };
}
function geometry(task, index) {
    const x = dayX(task.start);
    const end = dayX(task.finish);
    const top = y(index);
    return {
        x,
        end,
        top,
        width: end - x,
        topFace: `M${x} ${top}l8 -7h${end - x}l-8 7Z`,
        sideFace: `M${end} ${top}l8 -7v21l-8 7Z`,
    };
}
function edgePath(from, to) {
    const sourceIndex = rows.findIndex(([id]) => id === from.id);
    const targetIndex = rows.findIndex(([id]) => id === to.id);
    const startX = dayX(from.finish);
    const endX = dayX(to.start);
    const startY = y(sourceIndex) + 12;
    const endY = y(targetIndex) + 12;
    // A backward connector explicitly depicts an overlap, rather than a false finish/start chain.
    const turnX = Math.max(startX, endX) + 15;
    return `M${startX} ${startY}H${turnX}V${endY - 19}H${endX - 10}V${endY}H${endX}`;
}
/** Strings interpolate only validated integers and fixed, authored labels. */
export function renderProjectPlan(input) {
    const data = validate(input);
    const grid = [0, 20, 40, 60, 80]
        .map((day) => `<path class="project-plan__grid" d="M${dayX(day)} 56V347"/><text class="project-plan__tick" x="${dayX(day)}" y="378">J${day}</text>`)
        .join("");
    const connections = edges
        .map(([from, to]) => {
        const source = data.forecast.get(from);
        const destination = data.forecast.get(to);
        const d = edgePath(source, destination);
        return `<path class="project-plan__dependency" data-plan-edge="${from}:${to}" data-overlap="${destination.start < source.finish}" d="${d}"/>`;
    })
        .join("");
    const tasks = rows
        .map(([id, label], index) => {
        const base = data.baseline.get(id);
        const task = data.forecast.get(id);
        const g = geometry(task, index);
        return `<g data-plan-task="${id}"><text class="project-plan__label" x="20" y="${g.top + 9}">${label}</text><text class="project-plan__date" data-plan-dates="${id}" x="20" y="${g.top + 28}">J${task.start} → J${task.finish}</text><rect class="project-plan__baseline" data-plan-base="${id}" x="${dayX(base.start)}" y="${g.top - 8}" width="${dayX(base.finish) - dayX(base.start)}" height="34" rx="2"/><path class="project-plan__top" data-plan-top="${id}" d="${g.topFace}"/><path class="project-plan__side" data-plan-side="${id}" d="${g.sideFace}"/><rect class="project-plan__bar" data-plan-bar="${id}" x="${g.x}" y="${g.top}" width="${g.width}" height="21" rx="1"/></g>`;
    })
        .join("");
    const targetX = dayX(input.externalTargetWorkingDay);
    const finishX = dayX(input.forecast.finishWorkingDay);
    return `<svg class="project-plan" viewBox="0 0 1000 430" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg"><path class="project-plan__floor" d="M184 353H936l25 -16H210Z"/>${grid}<path class="project-plan__target" data-plan-target d="M${targetX} 45V350"/><text class="project-plan__target-label" data-plan-target-label x="${targetX}" y="29">CIBLE J${input.externalTargetWorkingDay}</text>${connections}${tasks}<g class="project-plan__finish" data-plan-finish style="transform:translateX(${finishX}px)"><path d="M0 339l7 7 -7 7 -7 -7Z"/><text data-plan-finish-label x="0" y="409">${input.forecast.finishWorkingDay > 80 ? "Au-delà : " : "Fin "}J${input.forecast.finishWorkingDay}</text></g></svg>`;
}
/** Updates stable elements; does not replace DOM or reset a running CSS transition. */
export function updateProjectPlan(host, input) {
    const data = validate(input);
    const svg = host.matches("svg.project-plan") ? host : host.querySelector("svg.project-plan");
    if (!svg)
        throw new Error("PROJECT_PLAN_NOT_MOUNTED");
    const set = (selector, attribute, value) => {
        svg.querySelector(selector)?.setAttribute(attribute, String(value));
    };
    const text = (selector, value) => {
        const element = svg.querySelector(selector);
        if (element)
            element.textContent = value;
    };
    for (const [index, [id]] of rows.entries()) {
        const base = data.baseline.get(id);
        const task = data.forecast.get(id);
        const g = geometry(task, index);
        set(`[data-plan-base="${id}"]`, "x", number(dayX(base.start)));
        set(`[data-plan-base="${id}"]`, "width", number(dayX(base.finish) - dayX(base.start)));
        set(`[data-plan-bar="${id}"]`, "x", number(g.x));
        set(`[data-plan-bar="${id}"]`, "width", number(g.width));
        set(`[data-plan-top="${id}"]`, "d", g.topFace);
        set(`[data-plan-side="${id}"]`, "d", g.sideFace);
        text(`[data-plan-dates="${id}"]`, `J${task.start} → J${task.finish}`);
    }
    for (const [from, to] of edges) {
        const source = data.forecast.get(from);
        const destination = data.forecast.get(to);
        const selector = `[data-plan-edge="${from}:${to}"]`;
        set(selector, "d", edgePath(source, destination));
        set(selector, "data-overlap", String(destination.start < source.finish));
    }
    const targetX = dayX(input.externalTargetWorkingDay);
    set("[data-plan-target]", "d", `M${targetX} 45V350`);
    set("[data-plan-target-label]", "x", targetX);
    text("[data-plan-target-label]", `CIBLE J${input.externalTargetWorkingDay}`);
    set("[data-plan-finish]", "style", `transform:translateX(${dayX(input.forecast.finishWorkingDay)}px)`);
    text("[data-plan-finish-label]", `${input.forecast.finishWorkingDay > 80 ? "Au-delà : " : "Fin "}J${input.forecast.finishWorkingDay}`);
}
