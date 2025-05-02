// Type definition for all translations
export interface Translations {
  common: {
    navigation: {
      home: string;
      gallery: string;
      personalNote: string;
      disclaimer: string;
      apiKey: string;
    };
    footer: {
      copyright: string;
    };
    languageToggle: {
      en: string;
      he: string;
    };
    loading: string;
    loadingGallery: string;
    showMore: string;
    errorLoading: string;
    noGalleryItems: string;
  };
  home: {
    title: string;
    tagline: string;
    hero: {
      title: string;
      tagline: string;
      disclaimer: string;
    };
    generator: {
      title: string;
      intro: string;
      apiKeyBanner: {
        title: string;
        description: string;
        info: string[];
        settings: string;
      };
      form: {
        placeholder: string;
        button: string;
        disclaimer: string;
        apiKeyPrompt: string;
        openSettings: string;
      };
      loading: string;
      error: {
        apiKey: string;
        serviceUnavailable: string;
        general: string;
        retryMessage: string;
        retryMoreAttempts: string;
        retryLastAttempt: string;
        persistentError: string;
      };
      result: {
        title: string;
        download: string;
        print: string;
      };
    };
  };
  gallery: {
    title: string;
    description: string;
  };
  disclaimer: {
    title: string;
    tagline: string;
    technical: {
      title: string;
      description: string;
      list: string[];
      note: string;
    };
    apiUsage: {
      title: string;
      description1: string;
      description2: string;
    };
    contentPolicy: {
      title: string;
      description: string;
      list: string[];
      note: string;
    };
  };
  personalNote: {
    title: string;
    tagline: string;
    sections: Array<{
      heading: string;
      content: string;
    }>;
    features: string[];
    limits: string;
    signatureName?: string;
    social?: string;
  };
}

// English translations (default)
export const englishTranslation: Translations = {
  common: {
    navigation: {
      home: "Home",
      gallery: "Gallery",
      personalNote: "Personal Note",
      disclaimer: "Disclaimer",
      apiKey: "🔑 GEMINI API KEY"
    },
    footer: {
      copyright: "© 2025 Almond Spark. All rights reserved."
    },
    languageToggle: {
      en: "English",
      he: "עברית"
    },
    loading: "Loading...",
    loadingGallery: "Loading gallery items...",
    showMore: "Show me more",
    errorLoading: "Error loading gallery items. Please try again later.",
    noGalleryItems: "No gallery items available yet. Generate some images first!"
  },
  home: {
    title: "Almond Spark",
    tagline: "Lighting New Paths to Connection",
    hero: {
      title: "AlmondSpark",
      tagline: "Lighting New Paths to Connection",
      disclaimer: "This is experimental only, we can't promise it will help you, we can't even promise it will generate correctly. It's free though..."
    },
    generator: {
      title: "Generate Your Visual Strip",
      intro: "Enter the idea or sentence you wish to convey and press the button",
      apiKeyBanner: {
        title: "📝 Before you start: Gemini API Key required",
        description: "To generate images, you need a free Gemini API key:",
        info: [
          "We use the free gemini-2.0-flash-exp model, so there's no cost to you.",
          "Your API key is saved only locally on your computer—never on our servers.",
          "We don't collect any personal information about users.",
          "Generated images are shared in the gallery for everyone's benefit."
        ],
        settings: "Click the settings icon ⚙️ in the top right corner to enter your key."
      },
      form: {
        placeholder: "Type your sentence here...",
        button: "Generate Icon Strip",
        disclaimer: "ALL the generations here will be shown randomly in the gallery section - make sure you don't use personal information in your strips.",
        apiKeyPrompt: "Please use the Settings to input your Gemini API key so we can generate strips for you.",
        openSettings: "Open Settings"
      },
      loading: "Creating your visual strip...",
      error: {
        apiKey: "Invalid or missing API key. Please enter a valid Gemini API key.",
        serviceUnavailable: "Service is temporarily unavailable due to high traffic.",
        general: "Sorry, something went wrong. Please try again in a few minutes.",
        retryMessage: "Automatic retry in progress...",
        retryMoreAttempts: "{count} more retries will be attempted if needed.",
        retryLastAttempt: "This is the last retry attempt.",
        persistentError: "If this problem persists, please contact us for assistance."
      },
      result: {
        title: "Your Visual Strip",
        download: "Download",
        print: "Print"
      }
    }
  },
  gallery: {
    title: "Gallery",
    description: "Explore visual strips created by our community"
  },
  disclaimer: {
    title: "Disclaimer",
    tagline: "Technical and legal information",
    technical: {
      title: "Technical Disclaimer",
      description: "I built Almond Spark for my own learning and to help my son communicate. I make no guarantees—technical, therapeutic, or otherwise.",
      list: [
        "I'm not responsible for what anyone else generates or shows to their kids.",
        "The tool may break, vanish, or return content you dislike.",
        "Lewd, harmful, or false results are possible. Use at your own risk."
      ],
      note: "If you spot something offensive or broken, email me and I'll try to fix or remove it—but I still can't promise anything."
    },
    apiUsage: {
      title: "API Usage",
      description1: "Almond Spark relies on Gemini API, which has usage quotas and limitations. During periods of heavy use, the service may become temporarily unavailable.",
      description2: "Users are required to input their own API keys to generate content through the service."
    },
    contentPolicy: {
      title: "Content Policy",
      description: "Almond Spark is intended for educational and communicative purposes only. Users are prohibited from using the service to:",
      list: [
        "Generate hateful, violent, or discriminatory content",
        "Violate copyright or intellectual property rights",
        "Create deceptive or misleading information"
      ],
      note: "I reserve the right to deny service to any user violating these guidelines."
    }
  },
  personalNote: {
    title: "Personal Note",
    tagline: "AlmondSpark in a nutshell",
    sections: [
      {
        heading: "Why this isn't an 'About' page",
        content: "This is not a startup company. This site is not meant to make money. This site is my personal project, as part of our family journey."
      },
      {
        heading: "The Problem",
        content: "Shortly after diagnosis, we received an iPad from the education department with an alternative augmentative communication (AAC) app, which was quite cumbersome and my son didn't connect with the concept of speaking in icons. Still, we understand the concept and understand that he is very visual and less verbal - also in the way he understands things."
      },
      {
        heading: "The Idea",
        content: "When generative AI technology became accessible, I decided to build a simpler, faster tool. Despite not knowing how to code in Python, with AI assistance and many sleepless nights, I turned ideas into practical tools."
      },
      {
        heading: "How it works now",
        content: "This site takes any idea or sentence you want to convey, breaks it down into basic concepts, and uses them to generate a strip of icons that help convey the idea visually. It's not magic and it's certainly not perfect, but hey, you didn't pay for it 🙂"
      },
      {
        heading: "Why not turn it into a paid service?",
        content: "I believe this is my way to give back, a bit of 'tikkun olam' even. And if I've helped even just one family to have a smoother day, or even just one interaction with communication, then it's totally worth it."
      },
      {
        heading: "How you can help",
        content: "Share this, send it to someone who needs it, create helpful graphics, ask, suggest - whatever flows for you."
      },
      {
        heading: "Thanks for visiting",
        content: "If you've stuck around through all this text - kudos to you 🙂"
      }
    ],
    features: [
      "Accepts any sentence or concept you want to illustrate visually.",
      "Breaks it down into basic concepts and converts them into a clear icon strip.",
      "You can print the strips, laminate and display when needed, stick/place in different parts of the house or even \"just\" show from your phone."
    ],
    limits: "Please note: The service has a usage quota; during high demand there may be delays - try again later."
  }
};

// Hebrew translations
export const hebrewTranslation: Translations = {
  common: {
    navigation: {
      home: "בית",
      gallery: "גלריה",
      personalNote: "הערה אישית",
      disclaimer: "הצהרת אחריות",
      apiKey: "🔑 מפתח GEMINI"
    },
    footer: {
      copyright: "© 2025 Almond Spark. כל הזכויות שמורות."
    },
    languageToggle: {
      en: "English",
      he: "עברית"
    },
    loading: "טוען...",
    loadingGallery: "טוען פריטי גלריה...",
    showMore: "הראה לי עוד",
    errorLoading: "שגיאה בטעינת פריטי גלריה. אנא נסה שוב מאוחר יותר.",
    noGalleryItems: "אין עדיין פריטי גלריה זמינים. צור תמונות קודם!"
  },
  home: {
    title: "Almond Spark",
    tagline: "מאירים דרכים חדשות לתקשורת",
    hero: {
      title: "AlmondSpark",
      tagline: "מאירים דרכים חדשות לתקשורת",
      disclaimer: "זהו כלי ניסיוני בלבד, השימוש הוא באחריותך בלבד. אנחנו לא מבטיחים שזה יועיל ואנחנו אפילו לא יכולים להבטיח שהכלי יעבוד כמו שצריך... אבל היי, זה כלי חינמי."
    },
    generator: {
      title: "צור רצועת תמונות ויזואלית",
      intro: "הזן את הרעיון או המשפט שברצונך להעביר ולחץ על הכפתור",
      apiKeyBanner: {
        title: "📝 לפני שמתחילים: נדרש מפתח API של Gemini",
        description: "כדי ליצור תמונות, אתה צריך מפתח API חינמי של Gemini:",
        info: [
          "אנו משתמשים במודל gemini-2.0-flash-exp החינמי, כך שאין לך עלויות.",
          "מפתח ה-API שלך נשמר רק מקומית במחשב שלך—לעולם לא בשרתים שלנו.",
          "איננו אוספים מידע אישי על משתמשים.",
          "תמונות שנוצרו משותפות בגלריה לטובת כולם."
        ],
        settings: "לחץ על סמל ההגדרות ⚙️ בפינה הימנית העליונה כדי להזין את המפתח שלך."
      },
      form: {
        placeholder: "הקלד את המשפט שלך כאן...",
        button: "יצירת רצועת סמלים",
        disclaimer: "כל היצירות כאן יוצגו באופן אקראי בחלק הגלריה - ודא שאינך משתמש במידע אישי ברצועות שלך.",
        apiKeyPrompt: "אנא השתמש בהגדרות כדי להזין את מפתח ה-API של Gemini שלך כדי שנוכל ליצור רצועות עבורך.",
        openSettings: "פתח הגדרות"
      },
      loading: "יוצר את הרצועה הויזואלית שלך...",
      error: {
        apiKey: "מפתח API חסר או לא תקין. אנא הזן מפתח Gemini תקף.",
        serviceUnavailable: "השירות אינו זמין זמנית עקב תעבורה גבוהה.",
        general: "מצטערים, משהו השתבש. אנא נסה שוב בעוד מספר דקות.",
        retryMessage: "ניסיון חוזר אוטומטי בתהליך...",
        retryMoreAttempts: "עוד {count} ניסיונות יבוצעו במידת הצורך.",
        retryLastAttempt: "זהו ניסיון חוזר אחרון.",
        persistentError: "אם הבעיה נמשכת, אנא צור איתנו קשר לקבלת עזרה."
      },
      result: {
        title: "הרצועה הויזואלית שלך",
        download: "הורדה",
        print: "הדפסה"
      }
    }
  },
  gallery: {
    title: "גלריה",
    description: "גלה רצועות ויזואליות שנוצרו על ידי הקהילה שלנו"
  },
  disclaimer: {
    title: "הצהרת אחריות",
    tagline: "מידע טכני ומשפטי",
    technical: {
      title: "הצהרת אחריות טכנית",
      description: "בניתי את Almond Spark ללמידה שלי ולעזור לבן שלי לתקשר. אני לא נותנת שום הבטחות - טכניות, טיפוליות, או אחרות.",
      list: [
        "אנחנו לא אחראיות למה שאחרות מייצרות או מראות לילדים שלהן.",
        "הכלי עלול להישבר, להיעלם, או להחזיר תוכן שלא תאהבנה.",
        "תוצאות פוגעניות, מזיקות, או שקריות אפשריות. השימוש על אחריותכן בלבד."
      ],
      note: "אם אתן מזהות משהו פוגעני או שבור, שלחו לנו מייל ואנחנו ננסה לתקן או להסיר אותו - אך עדיין איננו יכולות להבטיח דבר."
    },
    apiUsage: {
      title: "שימוש ב-API",
      description1: "Almond Spark מסתמך על ה-API של Gemini, שיש לו מכסות שימוש ומגבלות. בתקופות של שימוש כבד, השירות עלול להיות זמנית לא זמין.",
      description2: "המשתמשות נדרשות להזין את מפתחות ה-API שלהן כדי ליצור תוכן באמצעות השירות."
    },
    contentPolicy: {
      title: "מדיניות תוכן",
      description: "Almond Spark מיועד למטרות חינוכיות ותקשורתיות בלבד. חל איסור על משתמשות להשתמש בשירות כדי:",
      list: [
        "ליצור תוכן מלא שנאה, אלימות או מפלה",
        "להפר זכויות יוצרים או זכויות קניין רוחני",
        "ליצור מידע מטעה או מטעה"
      ],
      note: "אנו שומרות לעצמנו את הזכות לסרב לתת שירות לכל משתמשת המפרה הנחיות אלה."
    }
  },
  personalNote: {
    title: "הערה אישית",
    tagline: "AlmondSpark בקליפת אגוז",
    sections: [
      {
        heading: "למה זה לא דף 'אודות'",
        content: "זאת איננה חברת סטארט אפ. האתר הזה לא נועד לעשות כסף. האתר הזה הוא פרוייקט אישי שלי, כחלק מהמסע המשפחתי שלנו."
      },
      {
        heading: "הבעיה",
        content: "קצת אחרי האבחון, קיבלנו אייפד ממשרד החינוך עם אפליקציה לתקשורת חזותית חלופית (תח״ח), האפליקציה היתה מסורבלת למדי ושקד לא התחבר לקונספט של לדבר באייקונים. עדיין, אנחנו מבינים את הרעיון ומבינים שהוא מאד ויזואלי ופחות ורבלי - גם בדרך שהוא מבין את הדברים."
      },
      {
        heading: "הרעיון",
        content: "כשטכנולוגיית AI היוצרת הפכה נגישה, החלטתי לבנות כלי עזר פשוט ומהיר יותר. למרות שלא ידעתי לתכנת בפייתון, עם עזרת בינה מלאכותית ולילות רבים ללא שינה, הצלחתי להפוך רעיונות לכלי עבודה מעשי."
      },
      {
        heading: "איך זה עובד כיום",
        content: "האתר הזה לוקח כל רעיון או משפט שתרצו להעביר, מפרק אותו למושגים בסיסיים ומשתמש בהם כדי לג'נרט רצועה של אייקונים שיעזרו להעביר את את הרעיון בצורה ויזואלית. זה לא קסם ובטח שזה לא מושלם, אבל היי, לא שילמתם על זה 🙂"
      },
      {
        heading: "למה לא להפוך את זה לשירות בתשלום?",
        content: "אני מאמין שזאת הדרך שלי לתת קצת בחזרה, טיפת \"תיקון עולם\" אפילו. ואם עזרתי אפילו רק למשפחה אחת שיהיה להם יום חלק יותר, או אפילו אינטראקציה אחת עם תקשורת, אז זה לגמרי שווה את זה."
      },
      {
        heading: "איך אתם יכולים לעזור",
        content: "שתפו את זה, תשלחו למישהו שצריך, תצרו גרפיקות מועילות, תשאלו, תציעו - מה שזורם לכם."
      },
      {
        heading: "תודה שביקרתם",
        content: "אם החזקתם מעמד כל הטקסט הזה - כפיים 🙂"
      }
    ],
    features: [
      "מקבל כל משפט או מושג שתרצו להמחיש ויזואלית.",
      "מפרק אותו למושגים בסיסיים וממיר אותם לרצועת אייקונים ברורה.",
      "אפשר להדפיס את הרצועות, ללמנץ ולהראות כשרוצים, להדביק/להניח במקומות שונים בבית או אפילו \"רק\" להראות מהטלפון."
    ],
    limits: "לתשומת לבכם: השירות מוגבל במכסת שימוש; בעת עומס גבוה ייתכנו עיכובים - נסו שוב מאוחר יותר.",
    signatureName: "גילי ושקד",
    social: "מוזמנים לעקוב אחרינו ברשתות החברתיות"
  }
};