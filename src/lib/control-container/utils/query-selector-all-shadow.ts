export const querySelectorAllShadowRoots = (node: HTMLElement, selector: string) => {
    const nodes = [...node.querySelectorAll(selector)];
    const nodeIterator = document.createNodeIterator(
        node,
        NodeFilter.SHOW_ELEMENT,
        (node) => ((node as HTMLElement).shadowRoot ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT)
    );

    let currentNode = nodeIterator.nextNode();
    while (currentNode) {
        const shadow = (currentNode as HTMLElement).shadowRoot as Node;
        if (!!shadow) {
            nodes.push(...querySelectorAllShadowRoots(shadow as HTMLElement, selector));
        }
        currentNode = nodeIterator.nextNode();
    }

    return nodes;
}