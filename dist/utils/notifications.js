"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateMatchNotification = generateMatchNotification;
exports.sendEmailNotification = sendEmailNotification;
exports.generateReminderEmail = generateReminderEmail;
function generateMatchNotification(match, lostItem, foundItem) {
    const notifications = [];
    // Notification to person who lost the item
    notifications.push({
        to: lostItem.contactEmail,
        subject: `Potential Match Found for Your Lost ${lostItem.category}`,
        body: generateLostItemMatchEmail(match, lostItem, foundItem),
        type: 'match_found'
    });
    // Notification to person who found the item
    notifications.push({
        to: foundItem.contactEmail,
        subject: `Potential Owner Found for Your Found ${foundItem.category}`,
        body: generateFoundItemMatchEmail(match, lostItem, foundItem),
        type: 'match_found'
    });
    return notifications;
}
function generateLostItemMatchEmail(match, lostItem, foundItem) {
    const matchPercentage = Math.round(match.matchScore * 100);
    return `
Dear ${lostItem.contactName},

Great news! We found a potential match for your lost ${lostItem.category}.

MATCH DETAILS:
- Match Confidence: ${matchPercentage}%
- Found Item: ${foundItem.title}
- Location Found: ${foundItem.location}
- Date Found: ${foundItem.dateOccurred.toLocaleDateString()}
- Description: ${foundItem.description}

MATCHED CRITERIA:
${match.matchedFields.map(field => `✓ ${field.charAt(0).toUpperCase() + field.slice(1)}`).join('\n')}

CONTACT INFORMATION:
The person who found this item can be reached at:
- Name: ${foundItem.contactName}
- Email: ${foundItem.contactEmail}
${foundItem.contactPhone ? `- Phone: ${foundItem.contactPhone}` : ''}

Please contact them directly to verify if this is your item and arrange for pickup.

Best regards,
Lost & Found System
  `.trim();
}
function generateFoundItemMatchEmail(match, lostItem, foundItem) {
    const matchPercentage = Math.round(match.matchScore * 100);
    return `
Dear ${foundItem.contactName},

We found a potential owner for the ${foundItem.category} you reported as found.

MATCH DETAILS:
- Match Confidence: ${matchPercentage}%
- Lost Item: ${lostItem.title}
- Location Lost: ${lostItem.location}
- Date Lost: ${lostItem.dateOccurred.toLocaleDateString()}
- Description: ${lostItem.description}

MATCHED CRITERIA:
${match.matchedFields.map(field => `✓ ${field.charAt(0).toUpperCase() + field.slice(1)}`).join('\n')}

CONTACT INFORMATION:
The person who lost this item can be reached at:
- Name: ${lostItem.contactName}
- Email: ${lostItem.contactEmail}
${lostItem.contactPhone ? `- Phone: ${lostItem.contactPhone}` : ''}

They may contact you directly to verify ownership and arrange for pickup.

Thank you for helping reunite people with their belongings!

Best regards,
Lost & Found System
  `.trim();
}
// Simulated email sending function
async function sendEmailNotification(notification) {
    // In a real application, this would integrate with an email service like SendGrid, Mailgun, etc.
    console.log('📧 Email Notification:', {
        to: notification.to,
        subject: notification.subject,
        type: notification.type
    });
    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Simulate 95% success rate
    return Math.random() > 0.05;
}
function generateReminderEmail(item) {
    const daysSinceReported = Math.floor((new Date().getTime() - item.dateReported.getTime()) / (1000 * 60 * 60 * 24));
    return {
        to: item.contactEmail,
        subject: `Reminder: Your ${item.type} ${item.category} report`,
        body: `
Dear ${item.contactName},

This is a reminder about your ${item.type} item report from ${daysSinceReported} days ago.

Item: ${item.title}
Location: ${item.location}
Status: ${item.status}

If you have found your item or no longer need this report active, please update your listing.
If you have any additional information that might help with matching, please update your description.

Best regards,
Lost & Found System
    `.trim(),
        type: 'reminder'
    };
}
