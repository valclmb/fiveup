export const FEEDBACK_CONSTANTS = {
    MAX_MESSAGE_LENGTH: 1024,
    MAX_PAGE_URL_LENGTH: 2048,
    MAX_FEEDBACK_PER_USER: 3,
  } as const;
  
  export const FEEDBACK_ERRORS = {
    UNAUTHORIZED: "Unauthorized",
    INVALID_JSON: "Invalid JSON body",
    MESSAGE_REQUIRED: "Message is required",
    MESSAGE_TOO_LONG: `Message must be at most ${FEEDBACK_CONSTANTS.MAX_MESSAGE_LENGTH} characters`,
    PAGE_URL_REQUIRED: "Page URL is required",
    PAGE_URL_TOO_LONG: "Page URL is too long",
    RATE_LIMIT: "You already have several requests pending/in progress. Please wait before submitting new ones.",
    SAVE_FAILED: "Failed to save feedback",
  } as const;
  
  export const FEEDBACK_MESSAGES = {
    SUCCESS: "Your feedback was sent. We'll get in touch soon.",
    SUBMIT_ERROR: "Failed to send feedback.",
    EMPTY_MESSAGE: "Please enter your feedback.",
  } as const;