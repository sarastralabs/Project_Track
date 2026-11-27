import nodemailer from "nodemailer";

export type ZohoMailConfig = {
  host: string;
  port: number;
  user: string;
  pass: string;
  from: string;
};

export function createMailer(config: ZohoMailConfig) {
  const transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.port === 465,
    auth: {
      user: config.user,
      pass: config.pass,
    },
  });

  return {
    async sendInvite(to: string, inviteUrl: string) {
      return transporter.sendMail({
        from: config.from,
        to,
        subject: "You're invited to Sarastra Hub",
        text: `You've been invited to Sarastra Hub. Open: ${inviteUrl}`,
        html: `<p>You've been invited to Sarastra Hub.</p><p><a href="${inviteUrl}">Accept invite</a></p>`,
      });
    },
  };
}
