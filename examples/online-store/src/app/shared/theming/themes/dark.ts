import { GradientColor, RoundedCorner } from "../../types";
import { objectAsReadonly } from "../../utils/object";
import { ITheme } from "./interfaces/theme";
import { ButtonPresets, CheckboxPresets, ContextMenuPresets, DialogPresets, ScrollbarPresets } from "./presets";

const BUTTON_ROUNDED_CORNER: RoundedCorner = [8, 8, 8, 8],
    BUTTON_ROUNDED_RECT_PADDING = "4px 6px",
    CONTEXT_MENU_ROUNDED_CORNER: RoundedCorner = [12, 12, 12, 12],
    CONTEXT_MENU_PADDING = "8px 0px",
    DIALOG_ROUNDED_CORNER: RoundedCorner = [12, 12, 12, 12],
    DIALOG_PADDING = "36px 52px",
    X_DEEP_RED_PLASMA_GRADIENT: GradientColor = ["rgba(107, 188, 255, 0)", "rgb(255, 122, 162)"],
    X_LITE_BLUE_PLASMA_GRADIENT: GradientColor = ["rgba(255, 133, 133, 0)", "rgb(126, 219, 255)"],
    X_LITE_CYAN_PLASMA_GRADIENT: GradientColor = ["rgba(117, 193, 255, 0)", "rgb(219, 156, 255)"];

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
const manifest: ITheme = {
    onlineStore: {
        header: {
            background: "rgba(10, 8, 17, 0.75)",
            color: "rgb(206, 191, 220)",
            fontSize: "14px",
            menuButton: {
                normal: {
                    color: "none",
                    fill: ["rgba(0,0,0,0)", "rgba(0,0,0,0)"],
                    iconFill: "rgb(206, 191, 220)",
                },
                pressed: {
                    color: "none",
                    fill: ["rgba(0,0,0,0)", "rgba(0,0,0,0)"],
                    iconFill: "rgba(165, 158, 202, 1)",
                },
                focused: {
                    color: "none",
                    fill: ["rgba(0,0,0,0)", "rgba(0,0,0,0)"],
                    iconFill: "rgba(165, 158, 202, 1)",
                    outline: `2px solid rgba(212, 196, 228, 0.25)`,
                },
                disabled: {
                    color: "none",
                    fill: ["rgba(0,0,0,0)", "rgba(0,0,0,0)"],
                    iconFill: "rgba(212, 196, 228, 0.5)",
                },
            },
            search: {
                normal: {
                    background: "rgba(9, 5, 19, 0.15)",
                    borderColor: "rgba(206, 191, 220, 0)",
                    color: "rgb(206, 191, 220)",
                    fontSize: "14px",
                    fill: "rgb(158, 173, 202)",
                    placeholder: {
                        color: "rgba(151, 138, 182, 1)",
                        fontSize: "14px",
                    },
                },
                focused: {
                    background: "rgba(35, 15, 56, 0.15)",
                    borderColor: "rgba(206, 191, 220, 0.35)",
                    color: "rgba(255, 255, 255, 1)",
                    fontSize: "14px",
                    fill: "rgb(158, 166, 202)",
                    placeholder: {
                        color: "rgba(151, 138, 182, 1)",
                        fontSize: "14px",
                    },
                }
            },
        },
        scrollToEndButton: {
            rippleColor: "rgba(255, 255, 255, 0.2)",
            normal: {
                fill: ["rgba(20, 5, 32, 0.5)", "rgba(20, 5, 32, 0.5)"],
                iconFill: "rgb(206, 191, 220)",
                strokeGradientColor: X_LITE_CYAN_PLASMA_GRADIENT,
            },
            pressed: {
                fill: ["rgba(84, 33, 126, 0.5)", "rgba(84, 33, 126, 0.5)"],
                iconFill: "rgb(206, 191, 220)",
                strokeGradientColor: X_LITE_CYAN_PLASMA_GRADIENT,
            },
            disabled: {
                fill: ["rgba(84, 33, 126, .25)", "rgba(84, 33, 126, .25)"],
                iconFill: "rgba(206, 191, 220, .85)",
                strokeGradientColor: X_LITE_CYAN_PLASMA_GRADIENT,
            },
        },
        storeItems: {
            background: "linear-gradient(180deg, rgb(8, 4, 15) 0%, rgb(4, 16, 20) 100%)",
            backgroundImage: "url(background_infinity-dark.png)",
            banner: {
                rippleColor: "rgba(255, 255, 255, 0.2)",
                fill: 'rgba(84, 33, 126, 0.5)',
                background: ["rgba(45, 42, 77, 1)", "rgba(63, 45, 75, 1)"],
                color: "rgb(245, 234, 255)",
                borderColor: 'transparent',
            },
            group: {
                normal: {
                    background: ["rgba(79, 76, 100, 0.54)", "rgba(75, 62, 83, 0.54)"],
                    color: "rgb(206, 191, 220)",
                    fill: "rgb(206, 191, 220)",
                    borderColor: "transparent",
                },
                selected: {
                    background: ["rgba(142, 138, 170, 0.54)", "rgba(139, 120, 151, 0.54)"],
                    color: "rgb(206, 191, 220)",
                    fill: "rgb(206, 191, 220)",
                    borderColor: "transparent",
                },
                focused: {
                    background: ["rgba(142, 138, 170, 0.54)", "rgba(139, 120, 151, 0.54)"],
                    color: "rgb(206, 191, 220)",
                    fill: "rgb(206, 191, 220)",
                    borderColor: "rgba(206, 191, 220, 0.1)",
                },
                focusedSelected: {
                    background: ["rgba(142, 138, 170, 0.54)", "rgba(139, 120, 151, 0.54)"],
                    color: "rgb(206, 191, 220)",
                    fill: "rgb(206, 191, 220)",
                    borderColor: "rgba(206, 191, 220, 0.14)",
                },
            },
            storeItem: {
                content: {
                    textEditor: {
                        link: {
                            normal: {
                                color: "rgb(151, 202, 231)",
                            },
                            visited: {
                                color: "rgb(206, 176, 212)",
                            },
                            hover: {
                                color: "rgb(209, 238, 255)",
                            },
                            active: {
                                color: "rgb(236, 214, 144)",
                            },
                        },
                        comment: {
                            color: 'rgb(151, 202, 231)',
                            background: 'rgba(255, 255, 255, 0.15)'
                        },
                    },
                    background: ["rgba(45, 42, 77, 1)", "rgba(63, 45, 75, 1)"],
                    rippleColor: "rgba(255, 255, 255, 0.15)",
                    searchSubstringColor: "rgba(139, 0, 86, 0.84)",
                    editingTextBackground: "rgba(0, 0, 0, 0.1)",
                    editingTextFocusedOutline: "1px solid rgb(255, 255, 255, 0.15)",
                    fill: ["rgba(45, 42, 77, 1)", "rgba(63, 45, 75, 1)"],
                    statusColor: "rgba(148, 196, 218, 0.68)",
                    strokeWidth: 3,
                    color: "rgb(245, 234, 255)",
                },
                styles: {
                    focus: { stroke: `2px solid #e692ff` },
                },
            },
        },
        groups: {
            group: {
                background: "#10192b",
                normal: {
                    fill: "#10192b",
                    color: "#bfaad1",
                    iconColor: "#2c1e49",
                },
                focused: {
                    fill: "#4d1b91",
                    color: "#bfaad1",
                    iconColor: "#8f6cad",
                },
                selected: {
                    fill: "#48178b",
                    color: "#bfaad1",
                    iconColor: "#bfaad1",
                },
                selectedFocused: {
                    fill: "#4d1b91",
                    color: "#bfaad1",
                    iconColor: "#bfaad1",
                }
            }
        },
    },
    presets: {
        [ButtonPresets.PRIMARY]: {
            rippleColor: "rgba(255, 255, 255, 0.2)",
            normal: {
                fill: ["rgb(86, 22, 190)", "rgb(104, 0, 136)"],
                iconFill: "rgb(206, 191, 220)",
                color: "rgb(240, 217, 255)",
                roundedCorner: BUTTON_ROUNDED_CORNER,
                padding: BUTTON_ROUNDED_RECT_PADDING,
                strokeGradientColor: X_LITE_CYAN_PLASMA_GRADIENT,
            },
            pressed: {
                fill: ["rgb(68, 20, 146)", "rgb(89, 6, 114)"],
                iconFill: "rgb(206, 191, 220)",
                color: "rgb(240, 217, 255)",
                roundedCorner: BUTTON_ROUNDED_CORNER,
                padding: BUTTON_ROUNDED_RECT_PADDING,
                strokeGradientColor: X_LITE_CYAN_PLASMA_GRADIENT,
            },
            focused: {
                fill: ["rgb(86, 22, 190)", "rgb(104, 0, 136)"],
                iconFill: "rgb(206, 191, 220)",
                outline: "2px solid rgba(227, 134, 255, 0.25)",
                color: "rgb(240, 217, 255)",
                roundedCorner: BUTTON_ROUNDED_CORNER,
                padding: BUTTON_ROUNDED_RECT_PADDING,
                strokeGradientColor: X_LITE_CYAN_PLASMA_GRADIENT,
            },
            disabled: {
                fill: ["rgba(86, 22, 190, .25)", "rgba(104, 0, 136, .25)"],
                iconFill: "rgb(206, 191, 220)",
                color: "rgb(240, 217, 255)",
                roundedCorner: BUTTON_ROUNDED_CORNER,
                padding: BUTTON_ROUNDED_RECT_PADDING,
                strokeGradientColor: X_LITE_CYAN_PLASMA_GRADIENT,
            },
        },
        [ButtonPresets.SECONDARY]: {
            normal: {
                fill: ["rgb(255, 255, 255)", "rgb(185, 210, 233)"],
                iconFill: "rgb(48, 44, 160)",
                roundedCorner: BUTTON_ROUNDED_CORNER,
                padding: BUTTON_ROUNDED_RECT_PADDING,
            },
            pressed: {
                fill: ["rgb(226, 239, 245)", "rgb(156, 184, 209)"],
                iconFill: "rgb(48, 44, 160)",
                roundedCorner: BUTTON_ROUNDED_CORNER,
                padding: BUTTON_ROUNDED_RECT_PADDING,
            },
            focused: {
                fill: ["rgb(226, 239, 245)", "rgb(156, 184, 209)"],
                iconFill: "rgb(232, 217, 255)",
                roundedCorner: BUTTON_ROUNDED_CORNER,
                padding: BUTTON_ROUNDED_RECT_PADDING,
                outline: "2px solid rgb(136, 171, 202)",
            },
            disabled: {
                fill: ["rgba(255, 255, 255, .25)", "rgba(185, 210, 233, .25)"],
                iconFill: "rgb(35, 32, 122)",
                roundedCorner: BUTTON_ROUNDED_CORNER,
                padding: BUTTON_ROUNDED_RECT_PADDING,
            },
        },
        [ButtonPresets.THRID]: {
            normal: {
                fill: ["rgb(28, 25, 182)", "rgb(48, 0, 141)"],
                iconFill: "rgb(232, 217, 255)",
                roundedCorner: BUTTON_ROUNDED_CORNER,
                padding: BUTTON_ROUNDED_RECT_PADDING,
            },
            pressed: {
                fill: ["rgb(25, 22, 150)", "rgb(43, 6, 117)"],
                iconFill: "rgb(232, 217, 255)",
                roundedCorner: BUTTON_ROUNDED_CORNER,
                padding: BUTTON_ROUNDED_RECT_PADDING,
            },
            focused: {
                fill: ["rgb(25, 22, 150)", "rgb(43, 6, 117)"],
                iconFill: "rgb(232, 217, 255)",
                outline: "2px solid rgb(35, 6, 94)",
                roundedCorner: BUTTON_ROUNDED_CORNER,
                padding: BUTTON_ROUNDED_RECT_PADDING,
            },
            disabled: {
                fill: ["rgba(28, 25, 182, .25)", "rgba(48, 0, 141, .25)"],
                iconFill: "rgb(232, 217, 255, .5)",
                roundedCorner: BUTTON_ROUNDED_CORNER,
                padding: BUTTON_ROUNDED_RECT_PADDING,
            },
        },
        [ButtonPresets.SUCCESS]: {
            rippleColor: "rgba(255, 255, 255, 0.2)",
            normal: {
                fill: ["rgb(67, 19, 145)", "rgb(72, 22, 153)"],
                iconFill: "rgb(206, 191, 220)",
                color: "rgb(240, 217, 255)",
                roundedCorner: BUTTON_ROUNDED_CORNER,
                padding: BUTTON_ROUNDED_RECT_PADDING,
            },
            pressed: {
                fill: ["rgb(101, 37, 204)", "rgb(99, 34, 204)"],
                iconFill: "rgb(206, 191, 220)",
                color: "rgb(240, 217, 255)",
                roundedCorner: BUTTON_ROUNDED_CORNER,
                padding: BUTTON_ROUNDED_RECT_PADDING,
            },
            focused: {
                fill: ["rgb(67, 19, 145)", "rgb(72, 22, 153)"],
                iconFill: "rgb(206, 191, 220)",
                color: "rgb(240, 217, 255)",
                roundedCorner: BUTTON_ROUNDED_CORNER,
                padding: BUTTON_ROUNDED_RECT_PADDING,
            },
            disabled: {
                fill: ["rgba(67, 19, 145, .25)", "rgba(72, 22, 153, .25)"],
                iconFill: "rgb(206, 191, 220)",
                color: "rgb(240, 217, 255)",
                roundedCorner: BUTTON_ROUNDED_CORNER,
                padding: BUTTON_ROUNDED_RECT_PADDING,
            },
        },
        [ButtonPresets.CANCEL]: {
            rippleColor: "rgba(255, 255, 255, 0.1)",
            normal: {
                fill: ["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 0)"],
                iconFill: "rgb(206, 191, 220)",
                color: "rgb(199, 186, 255)",
                roundedCorner: BUTTON_ROUNDED_CORNER,
                padding: BUTTON_ROUNDED_RECT_PADDING,
            },
            pressed: {
                fill: ["rgba(255, 255, 255, 0.08)", "rgba(255, 255, 255, 0.08)"],
                iconFill: "rgb(206, 191, 220)",
                color: "rgb(160, 147, 218)",
                roundedCorner: BUTTON_ROUNDED_CORNER,
                padding: BUTTON_ROUNDED_RECT_PADDING,
            },
            focused: {
                fill: ["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 0)"],
                iconFill: "rgb(206, 191, 220)",
                color: "rgb(199, 186, 255)",
                roundedCorner: BUTTON_ROUNDED_CORNER,
                padding: BUTTON_ROUNDED_RECT_PADDING,
            },
            disabled: {
                fill: ["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 0)"],
                iconFill: "rgba(206, 191, 220, 0.45)",
                color: "rgba(199, 186, 255, 0.45)",
                roundedCorner: BUTTON_ROUNDED_CORNER,
                padding: BUTTON_ROUNDED_RECT_PADDING,
            },
        },
        [ButtonPresets.WARN]: {
            normal: {
                fill: ["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 0)"],
                iconFill: "rgb(206, 191, 220)",
                color: "rgb(255, 122, 120)",
                roundedCorner: BUTTON_ROUNDED_CORNER,
                padding: BUTTON_ROUNDED_RECT_PADDING,
            },
            pressed: {
                fill: ["rgba(255, 255, 255, 0.08)", "rgba(255, 255, 255, 0.08)"],
                iconFill: "rgb(206, 191, 220)",
                color: "rgb(223, 91, 164)",
                roundedCorner: BUTTON_ROUNDED_CORNER,
                padding: BUTTON_ROUNDED_RECT_PADDING,
            },
            focused: {
                fill: ["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 0)"],
                iconFill: "rgb(206, 191, 220)",
                outline: "2px solid rgba(227, 134, 255, 0.25)",
                color: "rgb(255, 122, 195)",
                roundedCorner: BUTTON_ROUNDED_CORNER,
                padding: BUTTON_ROUNDED_RECT_PADDING,
            },
            disabled: {
                fill: ["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 0)"],
                iconFill: "rgba(206, 191, 220, 0.45)",
                color: "rgba(255, 122, 195, 0.45)",
                roundedCorner: BUTTON_ROUNDED_CORNER,
                padding: BUTTON_ROUNDED_RECT_PADDING,
            },
        },
        [ButtonPresets.CONTEXT_MENU_PRIMARY]: {
            rippleColor: "rgba(255, 255, 255, 0.1)",
            normal: {
                fill: ["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 0)"],
                iconFill: "rgb(199, 186, 255)",
                color: "rgb(199, 186, 255)",
                padding: BUTTON_ROUNDED_RECT_PADDING,
            },
            pressed: {
                fill: ["rgba(255, 255, 255, 0.08)", "rgba(255, 255, 255, 0.08)"],
                iconFill: "rgb(229, 223, 255)",
                color: "rgb(229, 223, 255)",
                padding: BUTTON_ROUNDED_RECT_PADDING,
            },
            focused: {
                fill: ["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 0)"],
                iconFill: "rgb(229, 223, 255)",
                color: "rgb(229, 223, 255)",
                padding: BUTTON_ROUNDED_RECT_PADDING,
            },
            disabled: {
                fill: ["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 0)"],
                iconFill: "rgba(199, 186, 255, 0.45)",
                color: "rgba(199, 186, 255, 0.45)",
                padding: BUTTON_ROUNDED_RECT_PADDING,
            },
        },
        [ButtonPresets.CONTEXT_MENU_SECONDARY]: {
            rippleColor: "rgba(255, 255, 255, 0.1)",
            normal: {
                fill: ["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 0)"],
                iconFill: "rgb(199, 186, 255)",
                color: "rgb(199, 186, 255)",
                padding: BUTTON_ROUNDED_RECT_PADDING,
            },
            pressed: {
                fill: ["rgba(255, 255, 255, 0.08)", "rgba(255, 255, 255, 0.08)"],
                iconFill: "rgb(229, 223, 255)",
                color: "rgb(229, 223, 255)",
                padding: BUTTON_ROUNDED_RECT_PADDING,
            },
            focused: {
                fill: ["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 0)"],
                iconFill: "rgb(229, 223, 255)",
                color: "rgb(229, 223, 255)",
                padding: BUTTON_ROUNDED_RECT_PADDING,
            },
            disabled: {
                fill: ["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 0)"],
                iconFill: "rgba(199, 186, 255, 0.45)",
                color: "rgba(199, 186, 255, 0.45)",
                padding: BUTTON_ROUNDED_RECT_PADDING,
            },
        },
        [CheckboxPresets.PRIMARY]: {
            rippleColor: "rgba(255, 255, 255, 0.2)",
            normal: {
                fill: ["rgb(86, 22, 190)", "rgb(104, 0, 136)"],
                iconFill: "rgb(255, 221, 239)",
                color: "rgb(240, 217, 255)",
                roundedCorner: BUTTON_ROUNDED_CORNER,
                padding: BUTTON_ROUNDED_RECT_PADDING,
                strokeGradientColor: X_LITE_CYAN_PLASMA_GRADIENT,
            },
            pressed: {
                fill: ["rgb(68, 20, 146)", "rgb(89, 6, 114)"],
                iconFill: "rgb(255, 221, 239)",
                color: "rgb(240, 217, 255)",
                roundedCorner: BUTTON_ROUNDED_CORNER,
                padding: BUTTON_ROUNDED_RECT_PADDING,
                strokeGradientColor: X_LITE_CYAN_PLASMA_GRADIENT,
            },
            focused: {
                fill: ["rgb(86, 22, 190)", "rgb(104, 0, 136)"],
                iconFill: "rgb(255, 221, 239)",
                outline: "2px solid rgba(227, 134, 255, 0.25)",
                color: "rgb(240, 217, 255)",
                roundedCorner: BUTTON_ROUNDED_CORNER,
                padding: BUTTON_ROUNDED_RECT_PADDING,
                strokeGradientColor: X_LITE_CYAN_PLASMA_GRADIENT,
            },
            disabled: {
                fill: ["rgba(86, 22, 190, .25)", "rgba(104, 0, 136, .25)"],
                iconFill: "rgb(255, 221, 239)",
                color: "rgb(240, 217, 255)",
                roundedCorner: BUTTON_ROUNDED_CORNER,
                padding: BUTTON_ROUNDED_RECT_PADDING,
                strokeGradientColor: X_LITE_CYAN_PLASMA_GRADIENT,
            },
        },
        [CheckboxPresets.SECONDARY]: {
            normal: {
                fill: ["rgba(68, 62, 94, 1)", "rgba(79, 74, 104, 1)"],
                iconFill: "rgb(255, 221, 239)",
                color: "rgb(199, 186, 255)",
                roundedCorner: BUTTON_ROUNDED_CORNER,
                padding: BUTTON_ROUNDED_RECT_PADDING,
                strokeGradientColor: X_LITE_CYAN_PLASMA_GRADIENT,
            },
            pressed: {
                fill: ["rgb(89, 78, 151)", "rgb(100, 86, 177)"],
                iconFill: "rgb(255, 221, 239)",
                color: "rgb(172, 161, 223)",
                roundedCorner: BUTTON_ROUNDED_CORNER,
                padding: BUTTON_ROUNDED_RECT_PADDING,
                strokeGradientColor: X_LITE_CYAN_PLASMA_GRADIENT,
            },
            focused: {
                fill: ["rgb(89, 78, 151)", "rgb(100, 86, 177)"],
                iconFill: "rgb(255, 221, 239)",
                color: "rgb(172, 161, 223)",
                roundedCorner: BUTTON_ROUNDED_CORNER,
                padding: BUTTON_ROUNDED_RECT_PADDING,
                strokeGradientColor: X_LITE_CYAN_PLASMA_GRADIENT,
                outline: "2px solid rgb(136, 171, 202)",
            },
            disabled: {
                fill: ["rgba(75, 65, 134, 0.45)", "rgba(84, 71, 160, 0.45)"],
                iconFill: "rgb(255, 221, 239)",
                color: "rgba(199, 186, 255, 0.45)",
                roundedCorner: BUTTON_ROUNDED_CORNER,
                padding: BUTTON_ROUNDED_RECT_PADDING,
                strokeGradientColor: X_LITE_CYAN_PLASMA_GRADIENT,
            },
        },
        [DialogPresets.PRIMARY]: {
            fill: ["rgba(58, 54, 73, 1)", "rgba(67, 57, 85, 1)"],
            roundedCorner: DIALOG_ROUNDED_CORNER,
            padding: DIALOG_PADDING,
            strokeAnimationDuration: 10000,
            strokeGradientColor: X_DEEP_RED_PLASMA_GRADIENT,
            title: {
                fontSize: 14,
                fontWeight: "bold",
                textTransform: "uppercase",
                color: "rgb(199, 186, 255)",
            },
            message: {
                fontSize: 14,
                textTransform: "none",
                color: "rgb(199, 186, 255)",
            },
        },
        [DialogPresets.SECONDARY]: {
            fill: ["rgba(45, 30, 112, 1)", "rgba(45, 30, 112, 1)"],
            roundedCorner: DIALOG_ROUNDED_CORNER,
            padding: DIALOG_PADDING,
            strokeAnimationDuration: 10000,
            title: {
                fontSize: 12,
                textTransform: "uppercase",
                color: "rgb(126, 191, 218)",
            },
            message: {
                fontSize: 12,
                textTransform: "none",
                color: "rgb(203, 223, 223)",
            },
        },
        [ContextMenuPresets.PRIMARY]: {
            fill: ["rgba(58, 54, 73, 1)", "rgba(67, 57, 85, 1)"],
            roundedCorner: CONTEXT_MENU_ROUNDED_CORNER,
            padding: CONTEXT_MENU_PADDING,
            strokeAnimationDuration: 10000,
            strokeGradientColor: X_LITE_BLUE_PLASMA_GRADIENT,
            buttonPreset: ButtonPresets.CONTEXT_MENU_PRIMARY,
        },
        [ContextMenuPresets.SECONDARY]: {
            fill: ["rgba(45, 30, 112, 1)", "rgba(59, 30, 112, 1)"],
            roundedCorner: CONTEXT_MENU_ROUNDED_CORNER,
            padding: CONTEXT_MENU_PADDING,
            strokeAnimationDuration: 10000,
            strokeGradientColor: X_DEEP_RED_PLASMA_GRADIENT,
            buttonPreset: ButtonPresets.CONTEXT_MENU_SECONDARY,
        },
        [ScrollbarPresets.PRIMARY]: {
            fill: ["rgba(198, 172, 248, 1)", "rgba(168, 229, 250, 1)"],
            hoverFill: ["rgba(164, 137, 217, 1)", "rgba(128, 190, 211, 1)"],
            pressedFill: ["rgba(137, 109, 191, 1)", "rgba(101, 162, 183, 1)"],
            strokeGradientColor: X_LITE_BLUE_PLASMA_GRADIENT,
            strokeAnimationDuration: 1000,
            thickness: 6,
            roundCorner: [3, 3, 3, 3],
            rippleColor: 'rgb(103, 23, 255)',
            rippleEnabled: true,
        },
        [ScrollbarPresets.SECONDARY]: {
            fill: ["rgba(27, 33, 82, 1)", "rgba(34, 23, 61, 1)"],
            hoverFill: ["rgba(42, 50, 111, 1)", "rgba(55, 40, 93, 1)"],
            pressedFill: ["rgba(60, 69, 141, 1)", "rgba(78, 60, 123, 1)"],
            strokeGradientColor: X_LITE_BLUE_PLASMA_GRADIENT,
            strokeAnimationDuration: 1000,
            thickness: 6,
            roundCorner: [3, 3, 3, 3],
            rippleColor: 'rgb(103, 118, 243)',
            rippleEnabled: true,
        },
    }
};

const THEME_DARK = objectAsReadonly(manifest);

export {
    THEME_DARK,
};
