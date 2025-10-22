// src/theme/text-styles.ts
export const textStyles = {

    title: {
        description: 'This is used for the title of the page',
        value: {
            fontFamily: '{fonts.title}',
            fontSize: ['5xl', '5xl', '5xl'],
            lineHeight: 'shorter',
            fontWeight: 'normal',
            textTransform: 'uppercase'
        }
    },

    h1: {
        description: '',
        value: {
            fontFamily: '{fonts.h1}',
            fontSize: ['7xl', '7xl', '9xl'],
            lineHeight: 'shorter',
            fontWeight: 'normal',
            textTransform: 'uppercase',
            letterSpacing: 'normal'
        }
    },

    h2: {
        description: '',
        value: {
            fontFamily: '{fonts.h2}',
            fontSize: ['6xl', '6xl', '8xl'],
            lineHeight: 'normal',
            fontWeight: 'normal',
            textTransform: 'uppercase'
        }
    },

    h3: {
        description: '',
        value: {
            fontFamily: '{fonts.h3}',
            fontSize: ['5xl', '5xl', '5xl'],
            lineHeight: 'shorter',
            fontWeight: 'normal',
            textTransform: 'uppercase'
        }
    },

    h4: {
        description: '',
        value: {
            fontFamily: '{fonts.h4}',
            fontSize: ['md', 'lg', 'lg'],
            lineHeight: 'shorter',
            fontWeight: 'normal',
            textTransform: 'uppercase'
        }
    },

    subHeader: {
        description: '',
        value: {
            fontFamily: '{fonts.subHeader}',
            fontSize: ['xl', '2xl', '2xl'],
            lineHeight: 'shorter',
            fontWeight: 'light',
            textTransform: 'none'
        }

    },

    button: {
        description: '',
        value: {
            fontFamily: '{fonts.button}',
            fontSize: ['md', 'md', 'md'],
            lineHeight: 'shorter',
            fontWeight: 'medium',
            textTransform: 'uppercase',
        }
    },

    objectionReducing: {
        description: '',
        value: {
            fontFamily: '{fonts.body}',
            fontSize: ['md', 'md', 'md'],
            lineHeight: 'shorter',
            fontWeight: 'normal',
        }
    }

}
