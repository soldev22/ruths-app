# Social Media Campaign Manager - User Guide

## Overview
The Social Media Campaign Manager is a comprehensive tool for planning, scheduling, and tracking social media campaigns across multiple platforms. It provides centralized management for posts, campaigns, and performance analytics.

## Accessing the Social Media Manager

### For Admin Users:
1. Log in to the application
2. Open the sidebar (if collapsed, click the ▶ button)
3. Scroll to the **ADMIN** section at the bottom
4. Click on **Social Media**

### Direct URL:
Navigate to: `http://localhost:3000/social-media`

---

## Features

### 1. Dashboard (`/social-media`)
The main dashboard provides an overview of your social media activities:

- **Campaign Statistics**: Total campaigns, active campaigns, completed campaigns
- **Post Statistics**: Total posts, scheduled posts, published posts
- **Quick Actions**:
  - Create New Campaign
  - Create New Post
  - View Analytics

### 2. Campaign Management

#### Viewing Campaigns (`/social-media/campaigns`)
- Lists all your campaigns with filters for:
  - Status: All, Draft, Active, Paused, Completed
  - Platform: All platforms or specific ones (Facebook, Twitter, Instagram, LinkedIn, TikTok)
- Each campaign card shows:
  - Campaign name and description
  - Status badge
  - Start and end dates
  - Target platforms
  - Budget information (if set)
  - Number of posts associated with the campaign

#### Creating a Campaign (`/social-media/campaigns/new`)
Required fields:
- **Name**: Campaign title (e.g., "Spring Product Launch")
- **Description**: Brief overview of the campaign
- **Status**: Draft, Active, Paused, or Completed
- **Platforms**: Select one or more platforms:
  - Facebook
  - Twitter
  - Instagram
  - LinkedIn
  - TikTok
- **Dates**:
  - Start Date: When the campaign begins
  - End Date: When the campaign concludes
- **Goals**: Marketing objectives (e.g., "Increase brand awareness", "Drive website traffic")
- **Budget** (optional): Campaign budget amount

#### Viewing Campaign Details (`/social-media/campaigns/[id]`)
Campaign detail page includes three tabs:

**Overview Tab**:
- Full campaign details
- Edit campaign information
- Update status
- Delete campaign

**Posts Tab**:
- View all posts associated with this campaign
- Filter by post status
- Quick access to create new posts for this campaign

**Analytics Tab** (if analytics data exists):
- Performance metrics by platform
- Date range filtering
- Aggregated totals for:
  - Impressions
  - Reach
  - Engagement
  - Clicks
  - Conversions
  - Spend

### 3. Post Management

#### Viewing Posts (`/social-media/posts`)
- Lists all your social media posts
- Filter by:
  - Status: All, Draft, Scheduled, Published
  - Platform: All or specific platform
  - Campaign: All or specific campaign
- Each post card displays:
  - Content preview
  - Status and platform
  - Campaign name (if associated)
  - Scheduled/published date
  - Engagement metrics (likes, comments, shares, reach)

#### Creating a Post (`/social-media/posts/new`)
Required fields:
- **Content**: The post text/copy
  - Character count display
  - Platform-specific character limits enforced
- **Platform**: Select target platform
- **Campaign** (optional): Associate with a campaign
- **Status**: Draft, Scheduled, or Published
- **Scheduled Date** (required for Scheduled status): Date picker
- **Scheduled Time** (required for Scheduled status): Time picker
- **Media URLs** (optional): Add image/video URLs (comma-separated)
- **Hashtags** (optional): Add hashtags (comma-separated, without # symbol)
- **Mentions** (optional): Add user mentions (comma-separated, without @ symbol)

**Platform Character Limits**:
- Twitter: 280 characters
- Facebook: 63,206 characters
- Instagram: 2,200 characters
- LinkedIn: 3,000 characters
- TikTok: 2,200 characters

#### Viewing Post Details (`/social-media/posts/[id]`)
Post detail page shows:
- Full post content
- Platform and status
- Associated campaign (if any)
- Scheduled/published date
- Media attachments
- Hashtags and mentions
- **Engagement Metrics** (for published posts):
  - Likes
  - Comments
  - Shares
  - Reach
- Edit and delete options

### 4. Analytics Dashboard (`/social-media/analytics`)

View comprehensive performance metrics:

**Filters**:
- Campaign: Select specific campaign
- Date Range: Filter by start and end dates

**Metrics Display**:
- Table showing analytics by date and platform:
  - Impressions: Number of times content was displayed
  - Reach: Unique users who saw the content
  - Engagement: Total interactions (likes, comments, shares)
  - Clicks: Number of link clicks
  - Conversions: Completed desired actions
  - Spend: Advertising spend (if applicable)

**Totals Section**:
- Aggregated metrics across all filtered analytics data
- Helps track overall campaign performance

---

## Workflow Examples

### Example 1: Creating a Product Launch Campaign

1. **Create Campaign** (`/social-media/campaigns/new`):
   - Name: "Summer Collection Launch"
   - Description: "Promote new summer product line"
   - Platforms: Facebook, Instagram, Twitter
   - Start Date: June 1, 2025
   - End Date: June 30, 2025
   - Goals: "Drive sales", "Increase brand awareness"
   - Budget: $5,000

2. **Create Posts** for the Campaign:
   - Teaser post (scheduled for May 28)
   - Launch announcement (scheduled for June 1)
   - Product highlights (weekly throughout June)
   - End-of-campaign sale (scheduled for June 28)

3. **Track Performance**:
   - Monitor post engagement in real-time
   - View campaign analytics to measure ROI
   - Adjust strategy based on performance data

### Example 2: Scheduling Social Media Calendar

1. **Navigate to Posts** (`/social-media/posts`)
2. **Create multiple posts** with different scheduled dates:
   - Monday: Motivational quote
   - Wednesday: Product feature
   - Friday: Customer testimonial
3. **Set all to "Scheduled" status**
4. **System will track** when posts go live
5. **Review engagement** after publication

### Example 3: Analyzing Campaign Performance

1. **Go to Analytics** (`/social-media/analytics`)
2. **Select your campaign** from the dropdown
3. **Set date range** for analysis period
4. **Review metrics**:
   - Which platform performed best?
   - Which dates had highest engagement?
   - What was the total reach?
   - Did the campaign meet budget targets?
5. **Export insights** for stakeholder reporting

---

## API Integration

The social media manager includes REST APIs for external integrations:

### Campaigns API
- `GET /api/campaigns` - List all campaigns
- `POST /api/campaigns` - Create new campaign
- `GET /api/campaigns/[id]` - Get campaign details
- `PUT /api/campaigns/[id]` - Update campaign
- `DELETE /api/campaigns/[id]` - Delete campaign

### Posts API
- `GET /api/posts` - List all posts
- `POST /api/posts` - Create new post
- `GET /api/posts/[id]` - Get post details
- `PUT /api/posts/[id]` - Update post
- `DELETE /api/posts/[id]` - Delete post

### Analytics API
- `GET /api/analytics?campaignId=[id]` - Get analytics for campaign
- `POST /api/analytics` - Create analytics entry

All APIs require authentication via the `auth_token` cookie.

---

## Data Models

### Campaign Model
```typescript
{
  name: string;
  description: string;
  status: 'draft' | 'active' | 'paused' | 'completed';
  platforms: ('facebook' | 'twitter' | 'instagram' | 'linkedin' | 'tiktok')[];
  startDate: Date;
  endDate: Date;
  goals: string[];
  budget?: number;
  createdBy: ObjectId; // User reference
  createdAt: Date;
  updatedAt: Date;
}
```

### SocialPost Model
```typescript
{
  campaign?: ObjectId; // Campaign reference
  platform: 'facebook' | 'twitter' | 'instagram' | 'linkedin' | 'tiktok';
  content: string;
  status: 'draft' | 'scheduled' | 'published';
  scheduledAt?: Date;
  publishedAt?: Date;
  mediaUrls: string[];
  hashtags: string[];
  mentions: string[];
  engagement: {
    likes: number;
    comments: number;
    shares: number;
    reach: number;
  };
  createdBy: ObjectId; // User reference
  createdAt: Date;
  updatedAt: Date;
}
```

### CampaignAnalytics Model
```typescript
{
  campaign: ObjectId; // Campaign reference
  date: Date;
  platform: 'facebook' | 'twitter' | 'instagram' | 'linkedin' | 'tiktok';
  metrics: {
    impressions: number;
    reach: number;
    engagement: number;
    clicks: number;
    conversions: number;
    spend?: number;
  };
  createdAt: Date;
  updatedAt: Date;
}
```

---

## Best Practices

### Campaign Management
- Start campaigns as "Draft" until ready to launch
- Set realistic date ranges and budgets
- Clearly define goals for better tracking
- Use consistent naming conventions

### Post Scheduling
- Plan content calendar in advance
- Consider optimal posting times for each platform
- Preview posts before scheduling
- Keep platform-specific character limits in mind

### Analytics Tracking
- Record analytics data regularly
- Compare performance across platforms
- Track metrics that align with campaign goals
- Use date ranges to identify trends

### Content Strategy
- Maintain consistent brand voice
- Use relevant hashtags for discoverability
- Include engaging media when possible
- Monitor engagement and adjust strategy

---

## Troubleshooting

**Q: I can't see the Social Media link**
- A: Ensure you're logged in as an admin user. Only admin accounts can access the social media manager.

**Q: My post shows character limit error**
- A: Each platform has different character limits. Reduce your content length or switch to a platform with higher limits.

**Q: Campaign analytics are empty**
- A: Analytics data must be manually entered via the POST API or analytics form. The system doesn't automatically pull data from social platforms.

**Q: Posts aren't automatically publishing**
- A: The current system tracks scheduled posts but doesn't automatically publish them. You'll need to integrate with platform APIs for auto-publishing.

**Q: I deleted a campaign but posts still exist**
- A: Posts are not automatically deleted when campaigns are deleted. Delete posts separately or modify the campaign deletion logic to cascade delete.

---

## Future Enhancements

Potential features for future development:
- Direct API integration with social platforms (Facebook Graph API, Twitter API, etc.)
- Automatic post publishing at scheduled times
- Social media listening and monitoring
- AI-powered content suggestions
- Bulk post upload via CSV
- Advanced analytics dashboards with charts
- Team collaboration and approval workflows
- Content library for reusable assets
- A/B testing for post variations
- Automated reporting and email digests

---

## Technical Notes

### Database Collections
- `campaigns` - Campaign documents
- `socialposts` - Post documents
- `campaignanalytics` - Analytics documents

### Authentication
All routes require authentication. User information is extracted from the `auth_token` cookie using the `getUserFromToken` utility.

### User Isolation
All data is isolated by user. Each campaign, post, and analytics entry is associated with the `createdBy` user ID, ensuring users only see their own data.

### Platform Support
The system currently supports five major social media platforms:
- Facebook
- Twitter (X)
- Instagram
- LinkedIn
- TikTok

Additional platforms can be added by updating the platform enum in the respective models.
