import { env } from "../..";

export function GetDefaultEngine(): string {
  return `[OnlineSubsystemMcp.Xmpp]
bUseSSL=false
ServerAddr="ws://26.7.188.28:${env.XMPP_PORT}"
ServerPort=${env.XMPP_PORT}

[OnlineSubsystemMcp.Xmpp Prod]
bUseSSL=false

ServerAddr="ws://26.7.188.28:${env.XMPP_PORT}"
ServerPort=${env.XMPP_PORT}

[OnlineSubsystemMcp]
bUsePartySystemV2=false

[OnlineSubsystemMcp.OnlinePartySystemMcpAdapter]
bUsePartySystemV2=false

[OnlineSubsystem]
bHasVoiceEnabled=true

[Voice]
bEnabled=true

[XMPP]
bEnableWebsockets=true

[/Script/Engine.InputSettings]
+ConsoleKeys=Tilde
+ConsoleKeys=F8

[/Script/FortniteGame.FortPlayerController]
TurboBuildInterval=0.005f
TurboBuildFirstInterval=0.005f
bClientSideEditPrediction=false

[HTTP.Curl]
bAllowSeekFunction=false

[LwsWebSocket]
bDisableCertValidation=true

[ConsoleVariables]
FortMatchmakingV2.ContentBeaconFailureCancelsMatchmaking=0
Fort.ShutdownWhenContentBeaconFails=0
FortMatchmakingV2.EnableContentBeacon=0
;TODM Fix for External Game Servers (Adrenaline, FS_GS, etc)
net.AllowAsyncLoading=0

[Core.Log]
LogEngine=Verbose
LogStreaming=Verbose
LogNetDormancy=Verbose
LogNetPartialBunch=Verbose
OodleHandlerComponentLog=Verbose
LogSpectatorBeacon=Verbose
PacketHandlerLog=Verbose
LogPartyBeacon=Verbose
LogNet=Verbose
LogBeacon=Verbose
LogNetTraffic=Verbose
LogDiscordRPC=Verbose
LogEOSSDK=Verbose
LogXmpp=Verbose
LogParty=Verbose
LogParty=Verbose
LogMatchmakingServiceClient=Verbose
LogScriptCore=Verbose
LogSkinnedMeshComp=Verbose
LogFortAbility=Verbose
LogContentBeacon=Verbose
LogPhysics=Verbose
LogStreaming=Error`;
}

export function GetDefaultGame(version: number): string {
  let def: string = `[/Script/EngineSettings.GeneralProjectSettings]
ProjectID=(A=-2011270876,B=1182903154,C=-965786730,D=-1399474123)
ProjectName=Fortnite
ProjectDisplayedTitle=NSLOCTEXT("Backend", "FortniteMainWindowTitle", "Backend")
ProjectVersion=1.0.0
CompanyName=Epic Games, Inc.
CompanyDistinguishedName="CN=Epic Games, O=Epic Games, L=Cary, S=North Carolina, C=US"
CopyrightNotice=Copyright Epic Games, Inc. All Rights Reserved.
bUseBorderlessWindow=True

[VoiceChatManager]
bEnabled=true
bEnableOnLoadingScreen=true
bObtainJoinTokenFromPartyService=true
bAllowStateTransitionOnLoadingScreen=false
MaxRetries=5
RetryTimeJitter=1.0
RetryTimeBase=3.0
RetryTimeMultiplier=1.0
MaxRetryDelay=240.0
RequestJoinTokenTimeout=10.0
JoinChannelTimeout=120.0
VoiceChatImplementation=Vivox
NetworkTypePollingDelay=0.0
PlayJoinSoundRecentLeaverDelaySeconds=30.0
DefaultInputVolume=1.0
DefaultOutputVolume=1.0
JoinTimeoutRecoveryMethod=Reinitialize
JoinErrorWorkaroundMethod=ResetConnection
NetworkChangeRecoveryMethod=ResetConnection
bEnableBluetoothMicrophone=false
VideoPreferredFramerate=0
bEnableEOSReservedAudioStreams=true

[VoiceChat.EOS]
bEnabled=true

ReplayStreamerOverride=FortniteDSSReplayStreamer

[/Script/FortniteGame.FortPlayspaceGameState]
bUsePlayspaceSystem=true

[/Script/FortniteGame.FortGameStateAthena]
; BR: Whether to allow the player to build through objects that would normally block placement
bAllowBuildingThroughBlockingObjects=true

[/Script/FortniteGame.FortGameInstance]
KairosMinSupportedAppVersion=20
bBattleRoyaleMatchmakingEnabled=true
!FrontEndPlaylistData=ClearArray
FrontEndPlaylistData=(PlaylistName=Playlist_DefaultSolo, PlaylistAccess=(bEnabled=True, bIsDefaultPlaylist=true, bVisibleWhenDisabled=false, bDisplayAsNew=false, CategoryIndex=0, bDisplayAsLimitedTime=false, DisplayPriority=3))
+FrontEndPlaylistData=(PlaylistName=Playlist_DefaultDuo, PlaylistAccess=(bEnabled=True, bIsDefaultPlaylist=true, bVisibleWhenDisabled=false, bDisplayAsNew=false, CategoryIndex=0, bDisplayAsLimitedTime=false, DisplayPriority=4))
+FrontEndPlaylistData=(PlaylistName=Playlist_DefaultSquad, PlaylistAccess=(bEnabled=True, bIsDefaultPlaylist=true, bVisibleWhenDisabled=false, bDisplayAsNew=false, CategoryIndex=0, bDisplayAsLimitedTime=false, DisplayPriority=6))
+FrontEndPlaylistData=(PlaylistName=Playlist_BattleLab, PlaylistAccess=(bEnabled=False, bIsDefaultPlaylist=false, bVisibleWhenDisabled=true, bDisplayAsNew=false, CategoryIndex=1, bDisplayAsLimitedTime=false, DisplayPriority=16))

; Arena
+FrontEndPlaylistData=(PlaylistName=Playlist_ShowdownAlt_Solo, PlaylistAccess=(bEnabled=True, bIsDefaultPlaylist=true, bVisibleWhenDisabled=false, bDisplayAsNew=true, CategoryIndex=1, bDisplayAsLimitedTime=false, DisplayPriority=17))
+FrontEndPlaylistData=(PlaylistName=Playlist_ShowdownAlt_Duos, PlaylistAccess=(bEnabled=False, bIsDefaultPlaylist=true, bVisibleWhenDisabled=false, bDisplayAsNew=true, CategoryIndex=1, bDisplayAsLimitedTime=false, DisplayPriority=19))
+ExperimentalBucketPercentList=(ExperimentNum=23,Name="BattlePassPurchaseScreen",BucketPercents=(0, 50, 50))

[/Script/FortniteGame.FortPlayerPawn]
NavLocationValidityDistance=500
MoveSoundStimulusBroadcastInterval=0.5
bCharacterPartsCastIndirectShadows=true

[/Script/FortniteGame.FortOnlineAccount]
bShouldAthenaQueryRecentPlayers=false
bDisablePurchasingOnRedemptionFailure=false

[/Script/FortniteGame.FortPlayerControllerAthena]
bNoInGameMatchmaking=true

[/Script/GameFeatures.GameFeaturesSubsystemSettings]
+DisabledPlugins=DiscoveryBrowser


[VoiceChat.EOS]
bEnabled=true

[EOSSDK]
ProductName=VoicePlugin
ProductVersion=0.1
ProductId="d3df2e4cdf384ae0a2d87faa746d9f95"
SandboxId="d4ede3c68024456a85135250c48595a1"
DeploymentId="8bf4df3e0d154871b5c71b94d2f8994d"
ClientId="xyza7891WBgblbBRIWSsYVvQLjyUSvIo"
ClientSecret="CsDH07ei7JX5nlChe3XrthvsSsn1g4huyXAPLf3hmN8"

[/Script/FortniteGame.FortChatManager]
bShouldRequestGeneralChatRooms=true
bShouldJoinGlobalChat=true
bShouldJoinFounderChat=false
bIsAthenaGlobalChatEnabled=true
RecommendChatFailureDelay=30
RecommendChatBackoffMultiplier=2.0
RecommendChatRandomWindow=120.0
RecommendChatFailureCountCap=7

[OnlinePartyEmbeddedCommunication]
bRetainPartyStateFields=false
bPerformAutoPromotion=true
InviteNotificationDelaySeconds=1.0`;

  return def;
}

export function GetDefaultRuntimeOptions(): string {
  return `[/Script/FortniteGame.FortRuntimeOptions]
bEnableGlobalChat=true
bDisableGifting=false
bDisableGiftingPC=false
bDisableGiftingPS4=false
bDisableGiftingXB=false
!ExperimentalCohortPercent=ClearArray
+ExperimentalCohortPercent=(CohortPercent=100,ExperimentNum=20)`;
}
