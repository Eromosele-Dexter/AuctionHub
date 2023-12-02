export const VALIDATION_CODE_EMAIL_SUBJECT = 'Welcome to Auction Hub!👋🏽';

export const REGISTRATION_EMAIL_SUBJECT = 'Welcome to Auction Hub!👋🏽';

export function registrationEmailFormat(username: string, isHtml?: boolean): string {
  if (isHtml) {
    return `
        <p>Dear ${username},</p>
        <p>We are excited to welcome you to Auction Hub, your trusted online auction platform. Thank you for choosing us as your destination for a world of exciting auctions, amazing deals, and unique treasures.</p>
        <p>With Auction Hub, you can:</p>
        <ul>
            <li>Discover a wide range of items from various categories.</li>
            <li>Place bids on your favorite items and win great deals.</li>
            <li>Connect with a community of fellow auction enthusiasts.</li>
        </ul>
        <p>We're thrilled to have you as a part of our community. Your journey with Auction Hub begins today, and we look forward to sharing many incredible auction experiences with you.</p>
        <p>If you have any questions, need assistance, or want to learn more about how to get the most out of your Auction Hub account, feel free to reach out to our support team at <a href="dextere2512@gmail.com">Support</a>.</p>
        <p>Thank you for choosing Auction Hub. We're here to make your auction experience exceptional.</p>
        <p>Best regards,<br>The Auction Hub Team</p><br>
        <p><img src="[Company Logo URL]" alt="Auction Hub Logo"></p>
        <p><b>Auction Hub - Your Trusted Online Auction Platform</b><br>Website: <a href="https://imaginative-speculoos-2736de.netlify.app/">Auction Hub</a><br>Email: <a href="mailto:dextere2512@gmail.com">dextere2512@gmail.com</a></p>
        `;
  }
  return `
    Dear ${username},

    We are excited to welcome you to Auction Hub, your trusted online auction platform. Thank you for choosing us as your destination for a world of exciting auctions, amazing deals, and unique treasures.
    
    With Auction Hub, you can:
    
    Discover a wide range of items from various categories.
    Place bids on your favorite items and win great deals.
    Connect with a community of fellow auction enthusiasts.
    We're thrilled to have you as a part of our community. Your journey with Auction Hub begins today, and we look forward to sharing many incredible auction experiences with you.
    
    If you have any questions, need assistance, or want to learn more about how to get the most out of your Auction Hub account, feel free to reach out to our support team at dextere2512@gmail.com.
    
    Thank you for choosing Auction Hub. We're here to make your auction experience exceptional.
    
    Best regards,
    The Auction Hub Team
    
    [Company Logo]
    
    Auction Hub - Your Trusted Online Auction Platform
    Website: https://imaginative-speculoos-2736de.netlify.app/
    Email: dextere2512@gmail.com.
    `;
}

export const RESET_PASSWORD_EMAIL_SUBJECT = 'Reset Your Auction Hub Password';

export function validationCodeEmailFormat(username: string, validationCode: number, isHtml?: boolean) {
  if (isHtml) {
    return `
        <h1>Reset Your Auction Hub Password</h1>
        <p>Dear ${username},</p>
        <p>We have received a request to reset your password for your Auction Hub account. To ensure the security of your account, please follow the instructions below to complete the password reset process:</p>
        <p><strong>Validation Code: ${validationCode}</strong></p>
        <p>To reset your password, please click on the following link or copy and paste it into your web browser:</p>
        <p>If you did not request a password reset or believe this request is not initiated by you, please disregard this email. Your account security is important to us.</p>
        <p>Please note that the validation code provided above is an essential part of the password reset process. Make sure to enter it correctly on the password reset page.</p>
        <p>If you have any questions or need further assistance, please don't hesitate to contact our support team at <a href="mailto:dextere2512@gmail.com">dextere2512@gmail.com.</a></p>
        <p>Thank you for choosing Auction Hub.</p>
        <p>Best regards, <br>The Auction Hub Team</p>
        <img src="[Company Logo]" alt="Auction Hub Logo">
        <p>Auction Hub - Your Trusted Online Auction Platform</p>
        <p>Website: <a href="https://imaginative-speculoos-2736de.netlify.app/">[Auction Hub Website]</a></p>
        <p>Email: <a href="mailto:dextere2512@gmail.com">dextere2512@gmail.com</a></p>
        `;
  }
  return `  
    Dear ${username},
    
    We have received a request to reset your password for your Auction Hub account. To ensure the security of your account, please follow the instructions below to complete the password reset process:
    
    Validation Code: ${validationCode}
    
    
    If you did not request a password reset or believe this request is not initiated by you, please disregard this email. Your account security is important to us.
    
    Please note that the validation code provided above is an essential part of the password reset process. Make sure to enter it correctly on the password reset page.
    
    If you have any questions or need further assistance, please don't hesitate to contact our support team at dextere2512@gmail.com.
    
    Thank you for choosing Auction Hub.
    
    Best regards,
    The Auction Hub Team
    
    [Company Logo]
    
    Auction Hub - Your Trusted Online Auction Platform
    Website: https://imaginative-speculoos-2736de.netlify.app/
    Email: dextere2512@gmail.com`;
}

export const AUCTION_WON_EMAIL_SUBJECT = 'Congratulations on Winning the Auction!🏅';

export function auctionWonEmailFormat(username: string, itemName: string, isHtml?: boolean) {
  if (isHtml) {
    return `
        <div style="background-color: #f0f0f0; padding: 20px;">
        <div style="background-color: #ffffff; border-radius: 6px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); font-family: Arial, sans-serif;">
          <div style="text-align: center; padding: 20px;">
            <h1>Congratulations on Winning the Auction!</h1>
          </div>
          <p>Dear ${username},</p>
          <div style="padding: 20px;">
            <p>We're excited to inform you that you have won the auction for the following item:</p>
            <ul>
              <li><strong>Item Name:</strong> ${itemName}</li>
            </ul>
            <p>Congratulations on your successful bid! You are now the proud owner of this fantastic item.</p>
            <p>To complete the transaction and receive your item, please follow the instructions provided in the auction listing or contact the seller directly.</p>
            <p>If you have any questions or need further assistance regarding this purchase, please don't hesitate to reach out to our support team at [Support Email Address]. We're here to help.</p>
            <p>Thank you for choosing Auction Hub, and congratulations once again on your winning bid!</p>
          </div>
          <div style="text-align: center; padding: 20px;">
            <p><strong>The Auction Hub Team</strong></p>
            <p><a href="https://imaginative-speculoos-2736de.netlify.app/">Auction Hub - Your Trusted Online Auction Platform</a></p>
            <p>Email: <a href="mailto:dextere2512@gmail.com">dextere2512@gmail.com</a></p>
          </div>
        </div>
      </div>
        `;
  }
  return `
    Dear ${username},
    
    We're excited to inform you that you have won the auction for the following item:
    
    Item Name: ${itemName}

    Congratulations on your successful bid! You are now the proud owner of this fantastic item.
    
    To complete the transaction and receive your item, please follow the instructions provided in the auction listing or contact the seller directly.
    
    If you have any questions or need further assistance regarding this purchase, please don't hesitate to reach out to our support team at dextere2512@gmail.com. We're here to help.

    Thank you for choosing Auction Hub, and congratulations once again on your winning bid!

    Best regards,
    The Auction Hub Team

    [Company Logo]

    Auction Hub - Your Trusted Online Auction Platform
    Website: https://imaginative-speculoos-2736de.netlify.app/
    Email: dextere2512@gmail.com
    `;
}
