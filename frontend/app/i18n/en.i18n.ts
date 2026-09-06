const en = {
  back: "Back",
  notFound: {
    description: "This arena doesn't exist. Maybe it's been deleted — or it never existed at all.",
    backHome: "Return Home",
  },
  error: {
    title: "Something went wrong",
    fallback: "An unexpected error occurred. Please try again.",
    retry: "Try again",
    },
  
};

type TAppTranslation = typeof en;

export { en, type TAppTranslation };
