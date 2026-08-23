const languages = {
    c: {
        extension: ".c",
        compiler: "gcc",
        runtime: null
    },

    cpp: {
        extension: ".cpp",
        compiler: "g++",
        runtime: null
    },

    python: {
        extension: ".py",
        compiler: null,
        runtime: "python"
    },

    java: {
        extension: ".java",
        compiler: "javac",
        runtime: "java"
    }
};

module.exports = languages;