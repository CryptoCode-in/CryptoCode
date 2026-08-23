const {
    routeCode
} = require("./languageRouter");

async function execute(language, code, input = "") {

    if (!language) {
        return {
            success: false,
            output: "Language is required."
        };
    }

    if (!code || !code.trim()) {
        return {
            success: false,
            output: "Code cannot be empty."
        };
    }

    try {

        const result = await routeCode(
    language,
    code,
    input
);

        return {
            success: result.success,
            stage: result.stage,
            output: result.output
        };

    } catch (error) {

        console.error(
            "Execution error:",
            error
        );

        return {
            success: false,
            stage: "system",
            output: error.message
        };
    }
}

module.exports = {
    execute
};