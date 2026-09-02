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
    X_LITE_RED_PLASMA_GRADIENT: GradientColor = ["rgba(0,188,212,0)", "rgb(255, 192, 205)"],
    X_BLUE_PLASMA_GRADIENT: GradientColor = ["rgba(255, 133, 133, 0)", "rgb(36, 193, 255)"],
    X_LITE_CYAN_PLASMA_GRADIENT: GradientColor = ["rgba(117, 193, 255, 0)", "rgb(219, 156, 255)"];

/**
 * @author Evgenii Alexandrovich Grebennikov
 * @email djonnyx@gmail.com
 * @license Copyright (c) 2026 Evgenii Alexandrovich Grebennikov (djonnyx@gmail.com tg: http://t.me/djonnyx).
 */
const manifest: ITheme = {
    onlineStore: {
        header: {
            background: "rgba(67, 33, 139, 0.75)",
            color: "rgb(255, 255, 255)",
            fontSize: "14px",
            menuButton: {
                normal: {
                    color: "none",
                    fill: ["rgba(0,0,0,0)", "rgba(0,0,0,0)"],
                    iconFill: "rgb(255, 255, 255)",
                },
                pressed: {
                    color: "none",
                    fill: ["rgba(0,0,0,0)", "rgba(0,0,0,0)"],
                    iconFill: "rgb(255, 255, 255)",
                },
                focused: {
                    color: "none",
                    fill: ["rgba(0,0,0,0)", "rgba(0,0,0,0)"],
                    iconFill: "rgb(255, 255, 255))",
                    outline: `2px solid rgba(161, 153, 219, 0.25)`,
                },
                disabled: {
                    color: "none",
                    fill: ["rgba(0,0,0,0)", "rgba(0,0,0,0)"],
                    iconFill: "rgb(255, 255, 255)",
                },
            },
            search: {
                normal: {
                    background: "rgba(79, 46, 156, 0.15)",
                    borderColor: "rgba(255, 255, 255, 0)",
                    color: "rgb(255, 255, 255)",
                    fontSize: "14px",
                    fill: "rgb(255, 255, 255)",
                    placeholder: {
                        color: "rgba(255, 255, 255, .75)",
                        fontSize: "14px",
                    },
                },
                focused: {
                    background: "rgba(79, 46, 156, 0.15)",
                    borderColor: "rgb(255, 255, 255)",
                    color: "rgb(255, 255, 255)",
                    fontSize: "14px",
                    fill: "rgb(255, 255, 255)",
                    placeholder: {
                        color: "rgba(255, 255, 255, .75)",
                        fontSize: "14px",
                    },
                }
            },
        },
        scrollToEndButton: {
            rippleColor: "rgba(28, 133, 165, 0.1)",
            normal: {
                fill: ["rgba(114, 199, 255, 0.25)", "rgba(114, 199, 255, 0.25)"],
                iconFill: "rgb(255, 255, 255)",
                strokeGradientColor: X_BLUE_PLASMA_GRADIENT,
            },
            pressed: {
                fill: ["rgba(75, 140, 184, 0.25)", "rgba(75, 140, 184, 0.25)"],
                iconFill: "rgb(255, 255, 255)",
                strokeGradientColor: X_BLUE_PLASMA_GRADIENT,
            },
            disabled: {
                fill: ["rgba(114, 199, 255, 0.25)", "rgba(114, 199, 255, 0.25)"],
                iconFill: "rgb(255, 255, 255)",
                strokeGradientColor: X_BLUE_PLASMA_GRADIENT,
            },
        },
        storeItems: {
            background: "linear-gradient(180deg, rgb(80, 42, 155) 0%, rgb(53, 147, 184) 100%)",
            backgroundImage: "url(background_infinity.png)",
            banner: {
                rippleColor: "rgba(28, 133, 165, 0.25)",
                fill: 'rgba(84, 33, 126, 0.5)',
                background: ["rgb(255, 255, 255)", "rgba(233, 245, 255, 1)"],
                color: 'rgba(33, 64, 80, 1)',
                borderColor: 'transparent',
            },
            group: {
                normal: {
                    background: ["rgba(124, 83, 206, 0.74)", "rgba(95, 194, 233, 0.74)"],
                    color: "rgb(255, 255, 255)",
                    fill: "rgb(255, 255, 255)",
                    borderColor: "transparent",
                },
                selected: {
                    background: ["rgba(148, 112, 219, 0.74)", "rgba(122, 195, 224, 0.74)"],
                    color: "rgb(255, 255, 255)",
                    fill: "rgb(255, 255, 255)",
                    borderColor: "transparent",
                },
                focused: {
                    background: ["rgba(148, 112, 219, 0.74)", "rgba(122, 195, 224, 0.74)"],
                    color: "rgb(255, 255, 255)",
                    fill: "rgb(255, 255, 255)",
                    borderColor: "rgba(141, 108, 233, 0.64)",
                },
                focusedSelected: {
                    background: ["rgba(148, 112, 219, 0.74)", "rgba(122, 195, 224, 0.74)"],
                    color: "rgb(255, 255, 255)",
                    fill: "rgb(255, 255, 255)",
                    borderColor: "rgba(141, 108, 233, 0.47)",
                },
            },
            storeItem: {
                content: {
                    textEditor: {
                        link: {
                            normal: {
                                color: "rgb(94, 65, 255)",
                            },
                            visited: {
                                color: "rgb(136, 61, 185)",
                            },
                            hover: {
                                color: "rgb(53, 30, 187)",
                            },
                            active: {
                                color: "rgb(65, 141, 255)",
                            },
                        },
                        comment: {
                            color: 'rgba(33, 64, 80, 1)',
                            background: 'rgba(33, 82, 122, 0.1)'
                        },
                    },
                    background: ["rgb(255, 255, 255)", "rgba(233, 245, 255, 1)"],
                    rippleColor: "rgba(28, 133, 165, 0.25)",
                    searchSubstringColor: "rgba(255, 0, 191, 0.23)",
                    editingTextBackground: "rgba(255, 240, 185, 0.151)",
                    editingTextFocusedOutline: "1px solid rgb(24, 90, 151, 0.15)",
                    fill: ["rgb(255, 255, 255)", "rgba(233, 245, 255, 1)"],
                    statusColor: "rgba(62, 111, 174, 1)",
                    strokeWidth: 3,
                    color: 'rgba(33, 64, 80, 1)',
                },
                styles: {
                    focus: { stroke: `2px solid rgba(255, 255, 255, 1)` },
                },
            },
        },
        groups: {
            group: {
                background: "#ffffff",
                normal: {
                    fill: "#ffffff",
                    color: "#000000",
                    iconColor: "#b8cddd",
                },
                focused: {
                    fill: "#c7deeb",
                    color: "#000000",
                    iconColor: "#b8cddd",
                },
                selected: {
                    fill: "#d2eaf7",
                    color: "#000000",
                    iconColor: "#b8cddd",
                },
                selectedFocused: {
                    fill: "#bbd2df",
                    color: "#000000",
                    iconColor: "#b8cddd",
                }
            }
        },
    },
    presets: {
        [ButtonPresets.PRIMARY]: {
            rippleColor: "rgba(181, 238, 255, 0.3)",
            normal: {
                fill: ["rgb(28, 25, 182)", "rgb(48, 0, 141)"],
                iconFill: "rgb(232, 217, 255)",
                roundedCorner: BUTTON_ROUNDED_CORNER,
                padding: BUTTON_ROUNDED_RECT_PADDING,
                strokeGradientColor: X_BLUE_PLASMA_GRADIENT,
            },
            pressed: {
                fill: ["rgb(25, 22, 150)", "rgb(43, 6, 117)"],
                iconFill: "rgb(232, 217, 255)",
                roundedCorner: BUTTON_ROUNDED_CORNER,
                padding: BUTTON_ROUNDED_RECT_PADDING,
                strokeGradientColor: X_BLUE_PLASMA_GRADIENT,
            },
            focused: {
                fill: ["rgb(25, 22, 150)", "rgb(43, 6, 117)"],
                iconFill: "rgb(232, 217, 255)",
                outline: "2px solid rgb(35, 6, 94)",
                roundedCorner: BUTTON_ROUNDED_CORNER,
                padding: BUTTON_ROUNDED_RECT_PADDING,
                strokeGradientColor: X_BLUE_PLASMA_GRADIENT,
            },
            disabled: {
                fill: ["rgba(28, 25, 182, .25)", "rgba(48, 0, 141, .25)"],
                iconFill: "rgb(232, 217, 255, .5)",
                roundedCorner: BUTTON_ROUNDED_CORNER,
                padding: BUTTON_ROUNDED_RECT_PADDING,
                strokeGradientColor: X_BLUE_PLASMA_GRADIENT,
            },
        },
        [ButtonPresets.SECONDARY]: {
            normal: {
                fill: ["rgb(255, 255, 255)", "rgb(185, 210, 233)"],
                iconFill: "rgb(48, 44, 160)",
                roundedCorner: BUTTON_ROUNDED_CORNER,
                padding: BUTTON_ROUNDED_RECT_PADDING,
                strokeGradientColor: X_BLUE_PLASMA_GRADIENT,
            },
            pressed: {
                fill: ["rgb(226, 239, 245)", "rgb(156, 184, 209)"],
                iconFill: "rgb(48, 44, 160)",
                roundedCorner: BUTTON_ROUNDED_CORNER,
                padding: BUTTON_ROUNDED_RECT_PADDING,
                strokeGradientColor: X_BLUE_PLASMA_GRADIENT,
            },
            focused: {
                fill: ["rgb(226, 239, 245)", "rgb(156, 184, 209)"],
                iconFill: "rgb(232, 217, 255)",
                outline: "2px solid rgb(136, 171, 202)",
                roundedCorner: BUTTON_ROUNDED_CORNER,
                padding: BUTTON_ROUNDED_RECT_PADDING,
                strokeGradientColor: X_BLUE_PLASMA_GRADIENT,
            },
            disabled: {
                fill: ["rgba(255, 255, 255, .25)", "rgba(185, 210, 233, .25)"],
                iconFill: "rgb(35, 32, 122)",
                roundedCorner: BUTTON_ROUNDED_CORNER,
                padding: BUTTON_ROUNDED_RECT_PADDING,
                strokeGradientColor: X_BLUE_PLASMA_GRADIENT,
            },
        },
        [ButtonPresets.THRID]: {
            rippleColor: "rgba(255, 255, 255, 0.2)",
            normal: {
                fill: ["rgb(28, 25, 182)", "rgb(48, 0, 141)"],
                iconFill: "rgb(232, 217, 255)",
                roundedCorner: BUTTON_ROUNDED_CORNER,
                padding: BUTTON_ROUNDED_RECT_PADDING,
                strokeGradientColor: X_LITE_CYAN_PLASMA_GRADIENT,
            },
            pressed: {
                fill: ["rgb(25, 22, 150)", "rgb(43, 6, 117)"],
                iconFill: "rgb(232, 217, 255)",
                roundedCorner: BUTTON_ROUNDED_CORNER,
                padding: BUTTON_ROUNDED_RECT_PADDING,
                strokeGradientColor: X_LITE_CYAN_PLASMA_GRADIENT,
            },
            focused: {
                fill: ["rgb(25, 22, 150)", "rgb(43, 6, 117)"],
                iconFill: "rgb(232, 217, 255)",
                outline: "2px solid rgb(35, 6, 94)",
                roundedCorner: BUTTON_ROUNDED_CORNER,
                padding: BUTTON_ROUNDED_RECT_PADDING,
                strokeGradientColor: X_LITE_CYAN_PLASMA_GRADIENT,
            },
            disabled: {
                fill: ["rgba(28, 25, 182, .25)", "rgba(48, 0, 141, .25)"],
                iconFill: "rgb(232, 217, 255, .5)",
                roundedCorner: BUTTON_ROUNDED_CORNER,
                padding: BUTTON_ROUNDED_RECT_PADDING,
                strokeGradientColor: X_LITE_CYAN_PLASMA_GRADIENT,
            },
        },
        [ButtonPresets.SUCCESS]: {
            rippleColor: "rgba(255, 255, 255, 0.35)",
            normal: {
                fill: ["rgb(148, 213, 255)", "rgb(160, 217, 255)"],
                iconFill: "rgb(232, 217, 255)",
                color: "rgb(42, 79, 94)",
                roundedCorner: BUTTON_ROUNDED_CORNER,
                padding: BUTTON_ROUNDED_RECT_PADDING,
                strokeGradientColor: X_BLUE_PLASMA_GRADIENT,
            },
            pressed: {
                fill: ["rgb(120, 189, 235)", "rgb(136, 197, 238)"],
                iconFill: "rgb(232, 217, 255)",
                color: "rgb(58, 102, 119)",
                roundedCorner: BUTTON_ROUNDED_CORNER,
                padding: BUTTON_ROUNDED_RECT_PADDING,
                strokeGradientColor: X_BLUE_PLASMA_GRADIENT,
            },
            focused: {
                fill: ["rgb(148, 213, 255)", "rgb(160, 217, 255)"],
                iconFill: "rgb(232, 217, 255)",
                color: "rgb(42, 79, 94)",
                roundedCorner: BUTTON_ROUNDED_CORNER,
                padding: BUTTON_ROUNDED_RECT_PADDING,
                strokeGradientColor: X_BLUE_PLASMA_GRADIENT,
            },
            disabled: {
                fill: ["rgba(148, 213, 255, .25)", "rgba(160, 217, 255, .25)"],
                iconFill: "rgb(232, 217, 255, .5)",
                color: "rgba(42, 79, 94, 0.45)",
                roundedCorner: BUTTON_ROUNDED_CORNER,
                padding: BUTTON_ROUNDED_RECT_PADDING,
                strokeGradientColor: X_BLUE_PLASMA_GRADIENT,
            },
        },
        [ButtonPresets.CANCEL]: {
            rippleColor: "rgba(28, 133, 165, 0.1)",
            normal: {
                fill: ["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 0)"],
                iconFill: "rgb(206, 191, 220)",
                color: "rgb(27, 27, 36)",
                roundedCorner: BUTTON_ROUNDED_CORNER,
                padding: BUTTON_ROUNDED_RECT_PADDING,
                strokeGradientColor: X_BLUE_PLASMA_GRADIENT,
            },
            pressed: {
                fill: ["rgba(255, 255, 255, 0.08)", "rgba(255, 255, 255, 0.08)"],
                iconFill: "rgb(206, 191, 220)",
                color: "rgb(41, 41, 54)",
                roundedCorner: BUTTON_ROUNDED_CORNER,
                padding: BUTTON_ROUNDED_RECT_PADDING,
                strokeGradientColor: X_BLUE_PLASMA_GRADIENT,
            },
            focused: {
                fill: ["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 0)"],
                iconFill: "rgb(206, 191, 220)",
                color: "rgb(27, 27, 36)",
                roundedCorner: BUTTON_ROUNDED_CORNER,
                padding: BUTTON_ROUNDED_RECT_PADDING,
                strokeGradientColor: X_BLUE_PLASMA_GRADIENT,
            },
            disabled: {
                fill: ["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 0)"],
                iconFill: "rgba(206, 191, 220, 0.45)",
                color: "rgba(27, 27, 36, 0.45)",
                roundedCorner: BUTTON_ROUNDED_CORNER,
                padding: BUTTON_ROUNDED_RECT_PADDING,
                strokeGradientColor: X_BLUE_PLASMA_GRADIENT,
            },
        },
        [ButtonPresets.WARN]: {
            normal: {
                fill: ["rgb(255, 238, 238)", "rgb(233, 185, 185)"],
                iconFill: "rgb(138, 101, 85)",
                roundedCorner: BUTTON_ROUNDED_CORNER,
                padding: BUTTON_ROUNDED_RECT_PADDING,
                strokeGradientColor: X_LITE_RED_PLASMA_GRADIENT,
            },
            pressed: {
                fill: ["rgb(247, 215, 215)", "rgb(230, 175, 159)"],
                iconFill: "rgb(138, 101, 85)",
                roundedCorner: BUTTON_ROUNDED_CORNER,
                padding: BUTTON_ROUNDED_RECT_PADDING,
                strokeGradientColor: X_LITE_RED_PLASMA_GRADIENT,
            },
            focused: {
                fill: ["rgb(247, 215, 215)", "rgb(230, 175, 159)"],
                iconFill: "rgb(138, 101, 85)",
                outline: "2px solid rgb(231, 185, 163)",
                roundedCorner: BUTTON_ROUNDED_CORNER,
                padding: BUTTON_ROUNDED_RECT_PADDING,
                strokeGradientColor: X_LITE_RED_PLASMA_GRADIENT,
            },
            disabled: {
                fill: ["rgba(247, 215, 215, .25)", "rgba(230, 175, 159, .25)"],
                iconFill: "rgb(167, 129, 113)",
                roundedCorner: BUTTON_ROUNDED_CORNER,
                padding: BUTTON_ROUNDED_RECT_PADDING,
                strokeGradientColor: X_LITE_RED_PLASMA_GRADIENT,
            },
        },
        [ButtonPresets.CONTEXT_MENU_PRIMARY]: {
            rippleColor: "rgba(28, 133, 165, 0.1)",
            normal: {
                fill: ["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 0)"],
                iconFill: "rgb(50, 56, 88)",
                color: "rgb(50, 56, 88)",
                padding: BUTTON_ROUNDED_RECT_PADDING,
            },
            pressed: {
                fill: ["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 0)"],
                iconFill: "rgb(67, 73, 110)",
                color: "rgb(67, 73, 110)",
                padding: BUTTON_ROUNDED_RECT_PADDING,
            },
            focused: {
                fill: ["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 0)"],
                iconFill: "rgb(70, 77, 116)",
                color: "rgb(70, 77, 116)",
                padding: BUTTON_ROUNDED_RECT_PADDING,
            },
            disabled: {
                fill: ["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 0)"],
                iconFill: "rgba(50, 56, 88, 0.45)",
                color: "rgba(50, 56, 88, 0.45)",
                padding: BUTTON_ROUNDED_RECT_PADDING,
            },
        },
        [ButtonPresets.CONTEXT_MENU_SECONDARY]: {
            rippleColor: "rgba(28, 133, 165, 0.1)",
            normal: {
                fill: ["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 0)"],
                iconFill: "rgb(50, 56, 88)",
                color: "rgb(50, 56, 88)",
                padding: BUTTON_ROUNDED_RECT_PADDING,
            },
            pressed: {
                fill: ["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 0)"],
                iconFill: "rgb(67, 73, 110)",
                color: "rgb(67, 73, 110)",
                padding: BUTTON_ROUNDED_RECT_PADDING,
            },
            focused: {
                fill: ["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 0)"],
                iconFill: "rgb(70, 77, 116)",
                color: "rgb(70, 77, 116)",
                padding: BUTTON_ROUNDED_RECT_PADDING,
            },
            disabled: {
                fill: ["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 0)"],
                iconFill: "rgba(50, 56, 88, 0.45)",
                color: "rgba(50, 56, 88, 0.45)",
                padding: BUTTON_ROUNDED_RECT_PADDING,
            },
        },
        [CheckboxPresets.PRIMARY]: {
            rippleColor: "rgba(181, 238, 255, 0.3)",
            normal: {
                fill: ["rgb(28, 25, 182)", "rgb(48, 0, 141)"],
                iconFill: "rgb(232, 217, 255)",
                color: "rgb(50, 56, 88)",
                roundedCorner: BUTTON_ROUNDED_CORNER,
                padding: BUTTON_ROUNDED_RECT_PADDING,
                strokeGradientColor: X_BLUE_PLASMA_GRADIENT,
            },
            pressed: {
                fill: ["rgb(25, 22, 150)", "rgb(43, 6, 117)"],
                iconFill: "rgb(232, 217, 255)",
                color: "rgb(67, 73, 110)",
                roundedCorner: BUTTON_ROUNDED_CORNER,
                padding: BUTTON_ROUNDED_RECT_PADDING,
                strokeGradientColor: X_BLUE_PLASMA_GRADIENT,
            },
            focused: {
                fill: ["rgb(25, 22, 150)", "rgb(43, 6, 117)"],
                iconFill: "rgb(232, 217, 255)",
                color: "rgb(70, 77, 116)",
                outline: "2px solid rgb(35, 6, 94)",
                roundedCorner: BUTTON_ROUNDED_CORNER,
                padding: BUTTON_ROUNDED_RECT_PADDING,
                strokeGradientColor: X_BLUE_PLASMA_GRADIENT,
            },
            disabled: {
                fill: ["rgba(28, 25, 182, .25)", "rgba(48, 0, 141, .25)"],
                iconFill: "rgb(232, 217, 255, .5)",
                color: "rgba(50, 56, 88, 0.45)",
                roundedCorner: BUTTON_ROUNDED_CORNER,
                padding: BUTTON_ROUNDED_RECT_PADDING,
                strokeGradientColor: X_BLUE_PLASMA_GRADIENT,
            },
        },
        [CheckboxPresets.SECONDARY]: {
            normal: {
                fill: ["rgb(185, 210, 233)", "rgb(255, 255, 255)"],
                iconFill: "rgb(130, 187, 224)",
                color: "rgb(50, 56, 88)",
                roundedCorner: BUTTON_ROUNDED_CORNER,
                padding: BUTTON_ROUNDED_RECT_PADDING,
                strokeGradientColor: X_BLUE_PLASMA_GRADIENT,
            },
            pressed: {
                fill: ["rgb(173, 200, 224)", "rgb(226, 239, 245)"],
                iconFill: "rgb(113, 169, 206)",
                color: "rgb(67, 73, 110)",
                roundedCorner: BUTTON_ROUNDED_CORNER,
                padding: BUTTON_ROUNDED_RECT_PADDING,
                strokeGradientColor: X_BLUE_PLASMA_GRADIENT,
            },
            focused: {
                fill: ["rgb(173, 200, 224)", "rgb(226, 239, 245)"],
                iconFill: "rgb(113, 169, 206)",
                color: "rgb(70, 77, 116)",
                roundedCorner: BUTTON_ROUNDED_CORNER,
                padding: BUTTON_ROUNDED_RECT_PADDING,
                strokeGradientColor: X_BLUE_PLASMA_GRADIENT,
            },
            disabled: {
                fill: ["rgba(185, 210, 233, .25)", "rgba(255, 255, 255, .25)"],
                iconFill: "rgba(130, 187, 224, 0.45)",
                color: "rgba(50, 56, 88, 0.45)",
                roundedCorner: BUTTON_ROUNDED_CORNER,
                padding: BUTTON_ROUNDED_RECT_PADDING,
                strokeGradientColor: X_BLUE_PLASMA_GRADIENT,
            },
        },
        [DialogPresets.PRIMARY]: {
            fill: ["rgb(246, 250, 250)", "rgb(255, 255, 255)"],
            roundedCorner: DIALOG_ROUNDED_CORNER,
            padding: DIALOG_PADDING,
            strokeAnimationDuration: 10000,
            strokeGradientColor: X_BLUE_PLASMA_GRADIENT,
            title: {
                fontSize: 14,
                fontWeight: "bold",
                textTransform: "uppercase",
                color: "rgb(27, 27, 36)",
            },
            message: {
                fontSize: 14,
                textTransform: "none",
                color: "rgb(35, 35, 44)",
            },
        },
        [DialogPresets.SECONDARY]: {
            fill: ["rgb(49, 56, 73)", "rgb(45, 51, 66)"],
            roundedCorner: DIALOG_ROUNDED_CORNER,
            title: {
                fontSize: 13,
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
            fill: ["rgb(246, 250, 250)", "rgb(255, 255, 255)"],
            roundedCorner: CONTEXT_MENU_ROUNDED_CORNER,
            padding: CONTEXT_MENU_PADDING,
            strokeAnimationDuration: 10000,
            strokeGradientColor: X_BLUE_PLASMA_GRADIENT,
            buttonPreset: ButtonPresets.CONTEXT_MENU_PRIMARY,
        },
        [ContextMenuPresets.SECONDARY]: {
            fill: ["rgb(246, 250, 250)", "rgb(255, 255, 255)"],
            roundedCorner: CONTEXT_MENU_ROUNDED_CORNER,
            padding: CONTEXT_MENU_PADDING,
            strokeAnimationDuration: 10000,
            strokeGradientColor: X_BLUE_PLASMA_GRADIENT,
            buttonPreset: ButtonPresets.CONTEXT_MENU_SECONDARY,
        },
        [ScrollbarPresets.PRIMARY]: {
            fill: ["rgba(203, 184, 240, 1)", "rgba(171, 219, 238, 1)"],
            hoverFill: ["rgba(168, 147, 207, 1)", "rgba(141, 190, 209, 1)"],
            pressedFill: ["rgba(136, 115, 175, 1)", "rgba(108, 156, 175, 1)"],
            strokeGradientColor: X_BLUE_PLASMA_GRADIENT,
            strokeAnimationDuration: 1000,
            thickness: 6,
            roundCorner: [3, 3, 3, 3],
            rippleColor: 'rgb(119, 50, 255)',
            rippleEnabled: true,
        },
        [ScrollbarPresets.SECONDARY]: {
            fill: ["rgba(203, 184, 240, 1)", "rgba(171, 219, 238, 1)"],
            hoverFill: ["rgba(168, 147, 207, 1)", "rgba(141, 190, 209, 1)"],
            pressedFill: ["rgba(136, 115, 175, 1)", "rgba(108, 156, 175, 1)"],
            strokeGradientColor: X_BLUE_PLASMA_GRADIENT,
            strokeAnimationDuration: 1000,
            thickness: 6,
            roundCorner: [3, 3, 3, 3],
            rippleColor: 'rgba(255, 255, 255, .5)',
            rippleEnabled: true,
        },
    }
};

const THEME_LIGHT = objectAsReadonly(manifest);

export {
    THEME_LIGHT,
};
