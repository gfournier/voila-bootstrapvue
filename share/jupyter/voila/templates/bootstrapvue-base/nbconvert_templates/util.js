Vue.component('jupyter-widget-mount-point', {
    data() {
        return {
            renderFn: undefined,
            elem: undefined,
        }
    },
    props: ['mount-id'],
    created() {
        requestWidget(this.mountId);
    },
    mounted() {
        requestWidget(this.mountId)
            .then(widgetView => {
                    if (['VuetifyView', 'VuetifyTemplateView'].includes(widgetView.model.get('_view_name'))) {
                        this.renderFn = createElement => widgetView.vueRender(createElement);
                    } else {
                        while (this.$el.firstChild) {
                            this.$el.removeChild(this.$el.firstChild);
                        }
                        requirejs(['@jupyter-widgets/base'], widgets =>
                            widgets.JupyterPhosphorWidget.attach(widgetView.pWidget, this.$el)
                        );
                    }
                }
            );
    },
    render(createElement) {
        if (this.renderFn) {
            /* workaround for v-menu click */
            if (!this.elem) {
                this.elem = this.renderFn(createElement);
            }
            return this.elem;
        }
        return createElement('div', this.$slots.default ||
            [createElement('b-container' ,`[${this.mountId}]`)]);
    }
});

const widgetResolveFns = {};
const widgetPromises = {};

function provideWidget(mountId, widgetView) {
    if (widgetResolveFns[mountId]) {
        widgetResolveFns[mountId](widgetView);
    } else {
        widgetPromises[mountId] = Promise.resolve(widgetView);
    }
}

function requestWidget(mountId) {
    if (!widgetPromises[mountId]) {
        widgetPromises[mountId] = new Promise(resolve => widgetResolveFns[mountId] = resolve);
    }
    return widgetPromises[mountId];
}

window.init = async (voila) => {
    define("vue", {"Vue": Vue});

    const kernel = await voila.connectKernel();
    window.addEventListener('beforeunload', () => kernel.shutdown());

    const widgetManager = new voila.WidgetManager(kernel);
    await widgetManager.build_widgets();

    Object.values(widgetManager._models)
        .forEach(async (modelPromise) => {
            const model = await modelPromise;
            const meta = model.get('_metadata');
            const mountId = meta && meta.mount_id;
            if (mountId && model.get('_view_name')) {
                const view = await widgetManager.create_view(model);
                provideWidget(mountId, view);
            }
        });

    app.$data.loading = false;
    removeInterferingStyleTags();
};

function removeInterferingStyleTags() {
    // TODO
    document.querySelectorAll("style:not(#vuetify-theme-stylesheet)")
        .forEach((styleTag) => {
            if (styleTag.textContent.includes("/* Override Blueprint's _reset.scss styles */")) {
                document.head.removeChild(styleTag);
            }
        });
}
