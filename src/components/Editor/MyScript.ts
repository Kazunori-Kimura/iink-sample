import * as iink from 'iink-js';

export default class MyScript {
    public static ElementID = 'my-script';
    private static _instance?: MyScript;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private _editor?: any;
    private _element?: HTMLDivElement;

    private constructor() {
        // resize イベントのリスナーを登録
        window.addEventListener('resize', this.onResize.bind(this));
    }

    public static get instance() {
        if (!this._instance) {
            this._instance = new MyScript();
        }

        return this._instance;
    }

    public get editor() {
        return this._editor;
    }

    // --- public methods ---

    public init(el: HTMLDivElement) {
        this._element = el;
        this._editor = iink.register(
            this._element,
            {
                recognitionParams: {
                    type: 'TEXT',
                    protocol: 'WEBSOCKET',
                    server: {
                        applicationKey: process.env.REACT_APP_MYSCRIPT_APP_KEY,
                        hmacKey: process.env.REACT_APP_MYSCRIPT_HMAC_KEY,
                    },
                    iink: {
                        lang: 'ja_JP',
                    },
                },
            },
            undefined,
            {
                '.text': {
                    'line-height': 3.0,
                },
            }
        );
        console.log(this.editor);
    }

    public clear() {
        if (this.editor && this.editor.canClear) {
            this.editor.clear();
        }
    }

    /**
     * 変換結果を取得
     * @returns string
     */
    public export() {
        return this._editor?.model.exports['text/plain'];
    }

    // --- event handlers ---

    private onResize() {
        this._editor?.resize();
    }

    public dispose() {
        window.removeEventListener('resize', this.onResize.bind(this));
        this._editor?.close();
    }
}
