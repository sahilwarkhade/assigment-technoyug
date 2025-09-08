function emailHtml(fullName, verificationUrl) {
  return `<p>Hi ${fullName},</p>
    <p>Please click the link below to verify your email address:</p>
    <a href="${verificationUrl}">Verify Email</a>
    <p>This link will expire in 10 minutes.</p>`;
}

module.exports={emailHtml}
