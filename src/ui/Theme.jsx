import { createTheme } from "@mui/material/styles";
import * as myColors from "./Colors"

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: myColors.green,
            dark: myColors.green
        },
        secondary: {
            main: myColors.white,
            dark: myColors.white
        },
        background: {
            default: myColors.background,
            paper: myColors.background
        },
        text: {
            primary: myColors.white,
            secondary: myColors.secondaryText
        }
    }
});

export default darkTheme;