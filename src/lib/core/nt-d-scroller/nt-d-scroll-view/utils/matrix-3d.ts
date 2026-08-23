/**
 * matrix3d
 * @link https://github.com/DjonnyX/centrifugal/blob/main/src/lib/core/nt-d-scroller/nt-d-scroll-view/utils/matrix-3d.ts
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 */
export const matrix3d = (x: number, y: number) => {
  return `matrix3d(
          1,      0,      0,      0,
          0,      1,      0,      0,
          0,      0,      1,      0,
          ${x},   ${y},   0,      1
        )`;
};
