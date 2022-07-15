import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  styles: {
    global: {
      body: {
        backgroundColor: "gray.50",
        color: "black",
        fontSize: "md",
        fontWeight: "bold",
        fontFamily: ["Century Gothic", "sans-serif"],
      }
    }
  }
});

export default theme;
      


