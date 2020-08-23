import * as CanvaTypes from "@canva/editing-extensions-api-typings";

import { CanvaEditingExtensionHost, ControlName } from "@canva/editing-extensions-api-typings";

const { imageHelpers } = window.canva;
const canva = window.canva.init();

const state = {
    invertSlider: 50,
};

let img: HTMLImageElement;
let canvas: HTMLCanvasElement;

const applyInvert = async () => {
    const context = canvas.getContext("2d");
    if (context == null) {
        return;
    }

    console.log('Adjusting');

    context.filter = `invert(${state.invertSlider}%)`;
    console.log(`invert(${state.invertSlider}%)`);
    context.drawImage(img, 0, 0, canvas.width, canvas.height);
}

const renderControls = () => {
    const invertSlider = canva.create(ControlName.SLIDER, {
        id: "invertSlider",
        label: "Invert Ratio",
        value: state.invertSlider,
        min: 0,
        max: 100,
        step: 1,
    });

    const button = canva.create(ControlName.BUTTON, {
        id: "buttonExample",
        label: "No-Op Button Example",
    });

    const controls = [
        canva.create(ControlName.GROUP, {
            id: "groupExample",
            label: "Group Example",
            children: [
                button,
                invertSlider
            ],
        }),
    ];

    canva.updateControlPanel(controls);
};

canva.onControlsEvent(async (opts) => {
    if (opts.message.controlId == "invertSlider" && opts.message.message.type == 'setValue' && typeof opts.message.message.value == "number") {
        state[opts.message.controlId] = opts.message.message.value;

        applyInvert()
    }

    if (opts.message.commit) {
        renderControls();
    }
});

canva.onReady(async (opts) => {

    renderControls();

    if (opts.image == null) {
        return;
    }

    img = await imageHelpers.toImageElement(opts.image);
    canvas = document.createElement("canvas");

    canvas.width = opts.previewSize.width;
    canvas.height = opts.previewSize.height;
    canvas.style.width = "100%";
    canvas.style.height = "100%";

    document.body.appendChild(canvas);

    const context = canvas.getContext("2d");
    if (context == null) {
        return;
    }

    context.filter = `invert(${state.invertSlider}%)`;
    context.drawImage(img, 0, 0, canvas.width, canvas.height);
});

canva.onImageUpdate(async (opts) => {
    const context = canvas.getContext("2d");
    if (context == null) {
        return;
    }

    img = await imageHelpers.toImageElement(opts.image);
    context.drawImage(img, 0, 0, canvas.width, canvas.height);
});

canva.onSaveRequest(async () => {
    return await imageHelpers.fromCanvas("image/jpeg", canvas);
});