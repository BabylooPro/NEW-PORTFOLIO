// GET LANGUAGE INFO FROM LANGUAGE TYPE NAME
export const getLanguageInfo = (language: string | undefined) => {
    if (!language) return { iconClass: '', prismLanguage: 'plaintext' }; // IF NO LANGUAGE, RETURN PLAINTEXT

    return {
        iconClass: `devicon-${language.toLowerCase()}-plain colored`, // GET ICON CLASS
        prismLanguage: language.toLowerCase() // GET PRISM LANGUAGE
    };
}; 
