# Nyua Backend 

A comprehensive og fortnite backend built with Node.js, TypeScript, and MongoDB. This backend provides a complete Fortnite-like experience with matchmaking, social features, Discord integration, and more.

##  Game Features

### Core Fortnite Functionality
- **Battle Royale Gameplay** - Full BR matchmaking and session management
- **Arena Mode** - Competitive ranked gameplay with Hype scoring system
- **Multiple Playlists** - Support for various game modes and playlists
- **Season Support** - Dynamic season handling (currently supports Seasons 10, 12)
- **Cross-Platform Play** - Multi-platform support with proper user agent parsing

### Social Features
- **Friends System** - Complete friend request management (send, accept, decline)
- **User Presence** - Real-time online/offline status tracking
- **Party System** - Group up with friends before matchmaking
- **XMPP Chat** - Real-time messaging and communication

### Progression & Customization
- **Profile Management** - Multiple profile types (athena, common_core, etc.)
- **Item Shop** - Daily and weekly storefront with gifting support
- **Battle Pass** - Season progression and rewards
- **Locker/Cosmetics** - Full cosmetic management system

##  Backend Features

### Authentication & Security
- **OAuth2 Implementation** - Secure token-based authentication
- **JWT Tokens** - Access and refresh token management
- **Account Registration** - Multi-method account creation (Discord, Web)
- **Ban System** - User moderation and ban management

### Matchmaking System
- **Custom Matchmaking** - Support for private matches with custom keys
- **Region Selection** - Multi-region matchmaking support
- **Session Management** - Dedicated server session handling
- **Skill-Based Matching** - Arena division and Hype-based matching

### Discord Integration
- **Account Registration** - `/register` command for Discord-based account creation
- **Player Statistics** - `/players` command for server population info
- **Moderation Commands** - `/ban`, `/unban` for server management
- **Locker Viewing** - `/full-locker` to inspect player cosmetics
- **User Lookup** - `/lookup` for account information

### API Endpoints

#### Fortnite Game API
- `/fortnite/api/game/v2/matchmakingservice/*` - Matchmaking services
- `/fortnite/api/storefront/v2/*` - Item shop and catalog
- `/fortnite/api/cloudstorage/*` - Cloud storage and settings
- `/fortnite/api/events/*` - Events and tournaments
- `/friends/api/public/friends/*` - Friends management

#### Authentication API
- `/account/api/oauth/*` - OAuth authentication
- `/account/api/oauth/verify` - Token verification
- `/account/api/oauth/token` - Token generation

#### Content API
- `/content/api/pages/fortnite-game` - Game content and news
- `/fortnite/api/game/v2/profile/*` - Profile management

### Launcher api 
- cors for login endpoint

##  Database Schema

### User Models
- **Users** - Core user information and statistics
- **Accounts** - Account-specific data and season progress
- **Friends** - Friend relationships and requests

### Game Data
- **Profiles** - Multiple profile types with different data
- **Matchmaking Data** - Session and matchmaking information
- **Storefront Data** - Shop items and catalog

##  Setup & Installation

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB database
- Discord bot token (for Discord features)

### Environment Variables
```env
# Server Configuration
PORT=8080
XMPP_PORT=443
MATCHMAKER_PORT=8081
ENABLE_LOGS=true
ENABLE_TLS=false
AutoRotate=false

# Database
DB_URL=mongodb://127.0.0.1/Backend

# Security
CLIENT_SECRET=your_client_secret_here

# Discord Integration
BOT_TOKEN=your_discord_bot_token_here
RegisterChannelID=your_discord_channel_id_here
API_KEY=your_api_key_here
```

### Installation Steps
1. Clone the repository
2. Install dependencies: `npm install` or `bun install`
3. Configure environment variables in `config/.env`
4. Set up MongoDB database
5. Start the server: `bun run src/index.ts` or `npm start`

##  Game Modes

### Battle Royale
- Solo, Duo, Squad playlists
- Custom matchmaking support
- Region-based matchmaking

### Arena
- Ranked competitive mode
- Division system (Division 1-10)
- Hype points and persistent scoring
- Tournament-style gameplay

### Custom Games
- Private match support
- Custom key system for private lobbies
- Configurable game settings

##  Integrations

### Discord Bot Features
- **Account Registration** - Create accounts directly from Discord
- **Player Management** - View player counts and statistics
- **Moderation Tools** - Ban/unban functionality
- **Cosmetic Viewing** - Inspect player lockers and items
- **Account Lookup** - Search for player information

### XMPP Server
- Real-time messaging
- Friend presence updates
- Party communication
- Game invitations

##  Statistics & Analytics

### Player Tracking
- Online player counts
- Session duration tracking
- Regional player distribution
- Matchmaking statistics

### Performance Monitoring
- Request logging
- Error tracking
- Database performance metrics
- Cache hit rates

##  Development

### Built With
- **Node.js** - Runtime environment
- **TypeScript** - Type safety
- **Hono** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **Discord.js** - Discord integration
- **JWT** - Authentication
- **Bcrypt** - Password hashing

### Architecture
- Modular service structure
- Middleware-based authentication
- Caching layer for performance
- Environment-based configuration
- Comprehensive error handling

##  Notes

- This is the old Nyua Backend and may contain issues
- Originally designed for Fortnite Chapter 2 Seasons 10-12
- Some features may require additional configuration
- Discord integration requires proper bot setup
- MongoDB database setup required for full functionality

##  Contributing

Feel free to submit issues and pull requests to improve this backend. This project serves as a foundation for Fortnite private server development.
