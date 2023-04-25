import * as iink from 'iink-js';
import { browserAdaptor } from 'mathjax-full/js/adaptors/browserAdaptor';
import { RegisterHTMLHandler } from 'mathjax-full/js/handlers/html';
import { TeX } from 'mathjax-full/js/input/tex';
import { AllPackages } from 'mathjax-full/js/input/tex/AllPackages';
import { mathjax } from 'mathjax-full/js/mathjax';
import { SVG } from 'mathjax-full/js/output/svg';

const adaptor = browserAdaptor();
RegisterHTMLHandler(adaptor);

export type EditorType = 'MATH' | 'TEXT' | 'DIAGRAM' | 'Raw Content';

export interface IinkEvent extends Event {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    detail?: any;
}
type IinkEventHandler = (event: IinkEvent) => void;

interface InitParameters {
    el?: HTMLDivElement;
    type?: EditorType;
    events?: {
        onChange?: IinkEventHandler;
        onClear?: VoidFunction;
        onConvert?: VoidFunction;
        onExport?: IinkEventHandler;
        onResize?: IinkEventHandler;
    };
}

/**
 * latex の文字列を整形する
 * @see https://github.com/MyScript/iinkJS/blob/master/examples/v4/websocket_math_iink.html
 * @param latexExport
 * @returns
 */
export function cleanLatex(latexExport: string): string {
    if (latexExport.includes('\\\\')) {
        const steps = '\\begin{align*}' + latexExport + '\\end{align*}';
        return steps
            .replace('\\begin{aligned}', '')
            .replace('\\end{aligned}', '')
            .replace(new RegExp('(align.{1})', 'g'), 'aligned');
    }
    return latexExport.replace(new RegExp('(align.{1})', 'g'), 'aligned');
}

export default class MyScript {
    private static _instance?: MyScript;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private _editor?: any;
    private _element?: HTMLDivElement;
    private handlers: {
        onChange?: IinkEventHandler;
        onClear?: VoidFunction;
        onConvert?: VoidFunction;
        onExport?: IinkEventHandler;
        onResize?: IinkEventHandler;
    } = {};

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

    public get type(): EditorType {
        return this.editor.configuration.recognitionParams.type;
    }

    // --- public methods ---

    public init({ el, type = 'MATH', events = {} }: InitParameters) {
        this.handlers = events;
        if (el) {
            this._element = el;

            this._element.addEventListener('changed', this.onChange.bind(this));
            this._element.addEventListener('exported', this.onExport.bind(this));
        }

        if (typeof this.editor === 'undefined') {
            this._editor = iink.register(
                this._element,
                {
                    recognitionParams: {
                        type,
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
        } else {
            // クリアする
            this.clear();
            // 設定を更新する
            const config = { ...this.editor.configuration };
            config.recognitionParams.type = type;
            console.log(config);
            this.editor.configuration = config;
        }

        console.log(this.editor);
    }

    public setType(value: EditorType) {
        this.init({ type: value });
    }

    public clear() {
        if (this.editor && this.editor.canClear) {
            this.editor.clear();
            this.handlers.onClear?.();
        }
    }

    /**
     * 変換結果を取得
     * @returns string
     */
    public export() {
        if (this.type === 'TEXT') {
            return this._editor?.model?.exports?.['text/plain'];
        } else if (this.type === 'MATH') {
            // latex 形式で取得
            const data = this._editor?.model?.exports?.['application/x-latex'];
            if (typeof data === 'string') {
                const payload = cleanLatex(data);
                return payload;
            }
        }
        return '';
    }

    /**
     * SVG に変換する
     */
    public toSVG() {
        if (this.type === 'MATH') {
            // latex 形式で取得
            const data = this._editor?.model?.exports?.['application/x-latex'];
            if (typeof data === 'string') {
                // SVG に変換
                const tex = cleanLatex(data);
                console.log(tex);

                const mathjaxDocument = mathjax.document('', {
                    InputJax: new TeX({ packages: AllPackages }),
                    OutputJax: new SVG({ fontCache: 'none' }),
                });
                const mathjaxOptions = {
                    em: 16,
                    ex: 8,
                    containerWidth: 1280,
                };

                const node = mathjaxDocument.convert(tex, mathjaxOptions);
                return node;
            }
        }
    }

    // --- event handlers ---

    private onChange(event: IinkEvent) {
        this.handlers.onChange?.(event);
    }

    public onConvert() {
        if (this.editor?.canConvert) {
            this.editor?.convert();
            this.handlers.onConvert?.();
        }
    }

    private onExport(event: IinkEvent) {
        this.handlers.onExport?.(event);
    }

    private onResize(event: IinkEvent) {
        this._editor?.resize();
        this.handlers.onResize?.(event);
    }

    public dispose() {
        window.removeEventListener('resize', this.onResize.bind(this));
        this._element?.removeEventListener('changed', this.onChange.bind(this));
        this._element?.removeEventListener('exported', this.onExport.bind(this));
        this._editor?.close();
    }
}
