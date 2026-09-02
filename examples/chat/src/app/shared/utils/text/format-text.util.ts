import { resourceManager } from "../resource-manager";
import { ResourceStatus } from "../resource-manager/resource-manager";

export const SERVICE_WHITESPACE = '&__whitespace__;',
    SERVICE_COMPILED_URL = '&__url__;',
    SERVICE_HTML_TEXT = '$__html__;',
    SERVICE_COMMENT_TEXT = '$__comment__;',
    URL_PATTERN = /(https?:\/\/(?:www\.|(?!www))[\w\d\-_?=%,;\[\]&.][\w\d\-_?=%:,;\[\]&.]+[\w\d\-_?=%:,;\[\]&.]\.[\w\d\-_?=%:,;\[\]&.\/]{2,}|www\.[\w\d\-_?=%:,;\[\]&.][\w\d\-_?=%:,;\[\]&.]+[\w\d\-_?=%:,;\[\]&.\/]\.[^\w]{2,}|https?:\/\/(?:www\.|(?!www))[\w\d\-_?=%:,;\[\]&.]+\.[^\w]{2,}|www\.[\w\d\-_?=%:,;\[\]&.\/]+\.[^\w]{2,})|((?:www\.|(?!www))[\w\d\-_?=%:,;\[\]&.][\w\d\-_?=%:,;\[\]&.]+[\w\d\-_?=%:,;\[\]&.]\.[\w\d\-_?=%:,;\[\]&.\/]{2,}|www\.[\w\d\-_?=%:,;\[\]&.][\w\d\-_?=%:,;\[\]&.]+[\w\d\-_?=%:,;\[\]&.\/]\.[^\w]{2,})/gm,
    COMPILED_URL_PATTERN = /(<a[^a].+<\/a>|<span[^span].+<\/span>|<img[^>].+>)/gm,
    NON_SEARCHABLE_PATTERN = /(<a[^a].+<\/a>|<span[^span].+<\/span>|<img[^>].+>)/gm,
    LINEBREAK_PATTERN = /\r\n|\n|\r/gm,
    LINEBREAK_WHITESPACE_PATTERN = /\r\n|\n|\r|\s/gm,
    HTML_PATTERN = /(<.*>)/gsm,
    COMMENT_PATTERN = /(`+.*?`+)/gsm,
    SPAN_END = '</span>',
    NBSP = '&nbsp;',
    BR = '<br>',
    COMMENT_CHAR = /(\`|`)/gm,
    WHITESPACE = ' ',
    EMPTY_STRING = '';

const messageStatus = (time: string, mailed: boolean) => `&nbsp;<span${SERVICE_WHITESPACE}class="message-status"style="display:inline-flex;float:right;word-break:keep-all;">${time}&nbsp;<span${SERVICE_WHITESPACE}>${mailed ?
    `<svg${SERVICE_WHITESPACE}width="16"${SERVICE_WHITESPACE}height="16"${SERVICE_WHITESPACE}viewBox="0${SERVICE_WHITESPACE}0${SERVICE_WHITESPACE}16${SERVICE_WHITESPACE}16"style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;"><path${SERVICE_WHITESPACE}d="M0.306,9.037l3.184,3.184c0.293,0.292${SERVICE_WHITESPACE}0.768,0.292${SERVICE_WHITESPACE}1.061,-0l7.38,-7.381c0.293,-0.293${SERVICE_WHITESPACE}0.293,-0.768${SERVICE_WHITESPACE}0,-1.061c-0.293,-0.292${SERVICE_WHITESPACE}-0.768,-0.292${SERVICE_WHITESPACE}-1.061,0l-6.85,6.851c0,-0${SERVICE_WHITESPACE}-2.653,-2.654${SERVICE_WHITESPACE}-2.653,-2.654c-0.293,-0.293${SERVICE_WHITESPACE}-0.768,-0.293${SERVICE_WHITESPACE}-1.061,0c-0.292,0.293${SERVICE_WHITESPACE}-0.292,0.768${SERVICE_WHITESPACE}0,1.061Z"style="fill:inherit;"/><path${SERVICE_WHITESPACE}d="M8.313,12.221l7.381,-7.381c0.292,-0.293${SERVICE_WHITESPACE}0.292,-0.768${SERVICE_WHITESPACE}-0,-1.061c-0.293,-0.292${SERVICE_WHITESPACE}-0.768,-0.292${SERVICE_WHITESPACE}-1.061,0l-7.38,7.381c-0.293,0.293${SERVICE_WHITESPACE}-0.293,0.768${SERVICE_WHITESPACE}-0,1.061c0.292,0.292${SERVICE_WHITESPACE}0.768,0.292${SERVICE_WHITESPACE}1.06,-0Z"style="fill:inherit;"/></svg>` :
    `<svg${SERVICE_WHITESPACE}width="16"${SERVICE_WHITESPACE}height="16"${SERVICE_WHITESPACE}viewBox="0${SERVICE_WHITESPACE}0${SERVICE_WHITESPACE}16${SERVICE_WHITESPACE}16"${SERVICE_WHITESPACE}style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;"><path${SERVICE_WHITESPACE}d="M0.306,9.037l3.184,3.184c0.293,0.292${SERVICE_WHITESPACE}0.768,0.292${SERVICE_WHITESPACE}1.061,0l7.38,-7.381c0.293,-0.293${SERVICE_WHITESPACE}0.293,-0.768${SERVICE_WHITESPACE}0,-1.061c-0.293,-0.292${SERVICE_WHITESPACE}-0.768,-0.292${SERVICE_WHITESPACE}-1.061,0l-6.85,6.851l-2.653,-2.654c-0.293,-0.293${SERVICE_WHITESPACE}-0.768,-0.293${SERVICE_WHITESPACE}-1.061,0c-0.292,0.293${SERVICE_WHITESPACE}-0.292,0.768${SERVICE_WHITESPACE}0,1.061Z"${SERVICE_WHITESPACE}style="inherit"/></svg>
`}</span></span>`;

interface IFormatTextOptions {
    selectable?: boolean;
    mailed?: boolean;
    loading?: boolean;
}

export const getTextUrls = (text: string) => {
    const result = new Array<string>(), segments = text.match(URL_PATTERN);
    if (segments) {
        for (let i = 0, l = segments.length; i < l; i++) {
            const url = segments[i];
            result.push(url);
        }
    }
    return result;
}

export const getHTMLs = (text: string) => {
    const result = new Array<string>(), segments = text.match(HTML_PATTERN);
    if (segments) {
        for (let i = 0, l = segments.length; i < l; i++) {
            const html = segments[i];
            result.push(html);
        }
    }
    return result;
}

export const getComments = (text: string) => {
    const result = new Array<string>(), segments = text.match(COMMENT_PATTERN);
    if (segments) {
        for (let i = 0, l = segments.length; i < l; i++) {
            const comments = segments[i];
            result.push(comments);
        }
    }
    return result;
}

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
export const formatText = (str: string | undefined, time: string | undefined, options?: IFormatTextOptions) => {
    if (!str) {
        return EMPTY_STRING;
    }

    const loading = options?.loading ?? false,
        selectable = options?.selectable ?? false,
        mailed = options?.mailed ?? false;

    let result = str;
    // splice comments
    const comments = getComments(result),
        compiledComments = new Array<[number, string]>();
    if (comments) {
        for (let i = 0, l = comments.length; i < l; i++) {
            let comment = comments[i];
            result = result.replace(comment, `${SERVICE_COMMENT_TEXT}${i}`);
            comment = comment.replace(COMMENT_CHAR, EMPTY_STRING);
            compiledComments.push([i, comment]);
        }
    }

    // splice htmls
    const htmls = getHTMLs(result),
        compiledHTMLs = new Array<[number, string]>();
    if (htmls) {
        for (let i = 0, l = htmls.length; i < l; i++) {
            const html = htmls[i];
            result = result.replace(html, `${SERVICE_HTML_TEXT}${i}`);
            compiledHTMLs.push([i, html]);
        }
    }

    // url
    result = format(result, time, selectable, mailed, loading);
    // whitespace
    result = result.replaceAll(WHITESPACE, NBSP);
    // line break
    result = result.replaceAll(LINEBREAK_PATTERN, BR);
    // service whitespace
    result = result.replaceAll(SERVICE_WHITESPACE, WHITESPACE);
    // recovery htmls
    if (htmls) {
        for (let i = 0, l = compiledHTMLs.length; i < l; i++) {
            const [id, html] = compiledHTMLs[i];
            result = result.replace(`${SERVICE_HTML_TEXT}${id}`, html);
        }
    }
    // recovery comments
    if (comments) {
        for (let i = 0, l = compiledComments.length; i < l; i++) {
            const [id, comment] = compiledComments[i];
            result = result.replace(`${SERVICE_COMMENT_TEXT}${id}`, `<div style="display:inline-flex;padding:2px 4px;border-radius:6px;" class="comment">${comment}</div>`);
        }
    }
    return result;
};

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
const checkImage = (url: string) => {
    const status = resourceManager.getStatus(url);
    if (status === ResourceStatus.LOADED) {
        return resourceManager.get(url);
    }
    if (status === ResourceStatus.ERROR || status === ResourceStatus.NOT_ADDED) {
        resourceManager.add(url);
    }
    return undefined;
};

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
const format = (src: string, time: string | undefined, selectable: boolean, mailed: boolean, loading: boolean) => {
    let result = src;
    const urls = getTextUrls(src);
    if (urls) {
        const withoutWhiteSpaceAndLineBreak = result.replaceAll(LINEBREAK_WHITESPACE_PATTERN, EMPTY_STRING),
            compiledURLs = new Array<[number, string, boolean, number, number]>();
        for (let i = 0, l = urls.length; i < l; i++) {
            const url = urls[i];
            let image: string | undefined;
            if (!loading) {
                image = checkImage(url);
            }
            if (image) {
                const index = withoutWhiteSpaceAndLineBreak.indexOf(url);
                result = result.replace(url, `${SERVICE_COMPILED_URL}${i}`);
                compiledURLs.push([i, (`<span><img${SERVICE_WHITESPACE}src="${image}"${SERVICE_WHITESPACE}class="message-editor-image"${SERVICE_WHITESPACE}width="100%"${SERVICE_WHITESPACE}style="pointer-events:none;display:block;max-height:250px;object-fit:cover;margin:2px${SERVICE_WHITESPACE}auto;border-radius:6px;"/></span>`), true, index, url.length]);
            } else {
                const index = withoutWhiteSpaceAndLineBreak.indexOf(url);
                result = result.replace(url, `${SERVICE_COMPILED_URL}${i}`);
                compiledURLs.push([i, (`<a${SERVICE_WHITESPACE}href="${url}"${SERVICE_WHITESPACE}class="message-editor-link${selectable ? SERVICE_WHITESPACE + 'selectable' : EMPTY_STRING}${selectable ? SERVICE_WHITESPACE + 'interactive' : EMPTY_STRING}">${url}</a>`), false, index, url.length]);
            }
        }
        if (compiledURLs) {
            let grouped = new Array<[number, string, boolean]>(), position = 0, groupNext = false;
            for (let i = 0, l = compiledURLs.length; i < l; i++) {
                const [id, url, loaded, index, length] = compiledURLs[i], nextIndex = i < l - 1 ? i + 1 : -1,
                    nextCompiledURL = nextIndex > -1 ? compiledURLs[nextIndex] : undefined, nextStartPostion = nextCompiledURL?.[3];
                position = index + length;
                if (position === nextStartPostion) {
                    if (!groupNext) {
                        grouped = [];
                    }
                    groupNext = true;
                    grouped.push([id, url, loaded]);
                    result = result.replace(new RegExp(`${SERVICE_COMPILED_URL}${id}\n`), EMPTY_STRING);
                } else if (groupNext) {
                    let urlsGroup = `<span${SERVICE_WHITESPACE}style="width:100%;">`;
                    for (let j = 0, l1 = grouped.length; j < l1; j++) {
                        const group = grouped[j];
                        if (group[1] && group[1].replaceAll(LINEBREAK_PATTERN, EMPTY_STRING) !== EMPTY_STRING) {
                            urlsGroup += !group[2] && j < l1 ? `${group[1]}${BR}` : group[1];
                        }
                    }
                    urlsGroup += url;
                    urlsGroup += SPAN_END;
                    result = result.replace(`${SERVICE_COMPILED_URL}${id}`, urlsGroup);
                    groupNext = false;
                } else {
                    result = result.replace(`${SERVICE_COMPILED_URL}${id}`, url);
                    groupNext = false;
                }
            }
        }
    }
    if (time) {
        result = result + messageStatus(time, mailed);
    }
    return result.trim();
};

