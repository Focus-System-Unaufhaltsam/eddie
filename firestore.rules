rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isSignedIn() {
      return request.auth != null;
    }

    function validName(name) {
      return name.matches('^[A-Z0-9_]{2,15}$');
    }

    function validPlatform(platform) {
      return platform in ['AUTO', 'TIKTOK', 'INSTAGRAM', 'YOUTUBE', 'X', 'LINKEDIN', 'TWITCH', 'OTHER'];
    }

    function validHandle(handle) {
      return handle.matches('^[A-Za-z0-9._]{2,30}$');
    }

    function validLeaderboardEntry(docId) {
      return request.resource.data.keys().hasOnly([
          'name',
          'platform',
          'socialHandle',
          'socialDisplay',
          'docId',
          'score',
          'time',
          'rounds',
          'sessionId',
          'clientVersion',
          'userAgent',
          'timestamp'
        ])
        && validName(request.resource.data.name)
        && validPlatform(request.resource.data.platform)
        && validHandle(request.resource.data.socialHandle)
        && request.resource.data.socialDisplay is string
        && request.resource.data.socialDisplay.size() >= 3
        && request.resource.data.socialDisplay.size() <= 31
        && request.resource.data.docId == docId
        && request.resource.data.score is int
        && request.resource.data.score >= 3
        && request.resource.data.score <= 30
        && request.resource.data.time is number
        && request.resource.data.time >= 1
        && request.resource.data.time <= 900
        && request.resource.data.rounds is int
        && request.resource.data.rounds >= 1
        && request.resource.data.rounds <= 29
        && request.resource.data.sessionId is string
        && request.resource.data.sessionId.size() >= 16
        && request.resource.data.sessionId.size() <= 64
        && request.resource.data.clientVersion is string
        && request.resource.data.clientVersion.size() <= 40
        && request.resource.data.userAgent is string
        && request.resource.data.userAgent.size() <= 160
        && request.resource.data.timestamp == request.time;
    }

    match /leaderboard_eddie-v1/{docId} {
      allow read: if true;
      allow create: if isSignedIn() && validLeaderboardEntry(docId);
      allow update: if isSignedIn()
        && validLeaderboardEntry(docId)
        && resource.data.docId == docId
        && request.resource.data.docId == resource.data.docId
        && request.resource.data.name == resource.data.name
        && request.resource.data.platform == resource.data.platform
        && request.resource.data.socialHandle == resource.data.socialHandle
        && request.resource.data.socialDisplay == resource.data.socialDisplay
        && (
          request.resource.data.score > resource.data.score ||
          (request.resource.data.score == resource.data.score && request.resource.data.time < resource.data.time)
        );
      allow delete: if false;
    }

    match /{document=**} {
      allow read, write: if false;
    }
  }
}
