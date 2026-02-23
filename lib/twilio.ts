import Twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_PHONE_NUMBER;

function getClient(): Twilio.Twilio | null {
  if (!accountSid || !authToken || !fromNumber) return null;
  return Twilio(accountSid, authToken);
}

/**
 * Send an SMS via Twilio. Uses TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER from env.
 * @param to - Recipient phone number (E.164 format recommended, e.g. +33612345678)
 * @param body - Message text
 * @throws Error if Twilio is not configured or if the API call fails
 */
export async function sendSms(to: string, body: string): Promise<void> {
  const client = getClient();
  if (!client) {
    throw new Error(
      "Twilio is not configured (missing TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN or TWILIO_PHONE_NUMBER)",
    );
  }

  try {
    await client.messages.create({
      body,
      from: fromNumber,
      to: to.trim(),
    });
  } catch (err: unknown) {
    const twilioErr = err as { status?: number; code?: number; message?: string; moreInfo?: string };
    if (twilioErr?.code === 21612) {
      const hint =
        "Sending from a US number to some countries (e.g. UAE +971) is not allowed: use a local number or register a Sender ID for that country. See: https://www.twilio.com/docs/api/errors/21612";
      throw new Error(
        `Twilio: ${twilioErr?.message ?? "To/From combination not allowed"}. ${hint}`,
        { cause: err },
      );
    }
    throw err;
  }
}

export function isTwilioConfigured(): boolean {
  return Boolean(accountSid && authToken && fromNumber);
}
