import hljs from 'highlight.js/lib/core';
import json from 'highlight.js/lib/languages/json';
hljs.registerLanguage('json', json);

export class TextHighlightUtil {
    //--------------------------------------------------------------------------
    //
    // 	Static Methods
    //
    //--------------------------------------------------------------------------

    public static text(data: string): string {
        let value = hljs.highlight(data, { language: 'json' }).value;
        return value;
    }
}
