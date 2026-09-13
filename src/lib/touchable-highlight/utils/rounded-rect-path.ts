export const roundedRectPath = (width: number, height: number, tl: number, tr: number, br: number, bl: number) => {
    const top = width - tl - tr,
        right = height - tr - br,
        bottom = width - br - bl,
        left = height - bl - tl,
        d = `
          M${tl},0
          h${top}
          a${tr},${tr} 0 0 1 ${tr},${tr}
          v${right}
          a${br},${br} 0 0 1 -${br},${br}
          h-${bottom}
          a${bl},${bl} 0 0 1 -${bl},-${bl}
          v-${left}
          a${tl},${tl} 0 0 1 ${tl},-${tl}
          z
      `;
    return d;
};
