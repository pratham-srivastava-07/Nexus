import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Responsive scaling function
const scale = (size: number) => (screenWidth / 375) * size;
const verticalScale = (size: number) => (screenHeight / 812) * size;

interface ChatItemProps {
  avatar: string;
  name: string;
  message: string;
  time: string;
  unreadCount?: number;
  isOnline?: boolean;
}

const ChatItem: React.FC<ChatItemProps> = ({
  avatar,
  name,
  message,
  time,
  unreadCount,
  isOnline,
}) => {
  return (
    <TouchableOpacity
      style={{
        flexDirection: 'row',
        paddingHorizontal: scale(16),
        paddingVertical: verticalScale(12),
        alignItems: 'center',
        backgroundColor: '#000',
      }}
    >
      {/* Avatar */}
      <View
        style={{
          width: scale(50),
          height: scale(50),
          borderRadius: scale(25),
          backgroundColor: '#333',
          justifyContent: 'center',
          alignItems: 'center',
          marginRight: scale(12),
        }}
      >
        <Text style={{ fontSize: scale(18), color: '#fff' }}>{avatar}</Text>
        {isOnline && (
          <View
            style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              width: scale(14),
              height: scale(14),
              borderRadius: scale(7),
              backgroundColor: '#00ff00',
              borderWidth: 2,
              borderColor: '#000',
            }}
          />
        )}
      </View>

      {/* Content */}
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: verticalScale(4),
          }}
        >
          <Text
            style={{
              fontSize: scale(16),
              fontWeight: '600',
              color: '#fff',
              flex: 1,
            }}
            numberOfLines={1}
          >
            {name}
          </Text>
          <Text
            style={{
              fontSize: scale(12),
              color: '#888',
              marginLeft: scale(8),
            }}
          >
            {time}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              fontSize: scale(14),
              color: '#888',
              flex: 1,
              marginRight: scale(8),
            }}
            numberOfLines={1}
          >
            {message}
          </Text>
          {unreadCount && unreadCount > 0 && (
            <View
              style={{
                backgroundColor: '#25D366',
                borderRadius: scale(10),
                minWidth: scale(20),
                height: scale(20),
                justifyContent: 'center',
                alignItems: 'center',
                paddingHorizontal: scale(6),
              }}
            >
              <Text
                style={{
                  color: '#fff',
                  fontSize: scale(12),
                  fontWeight: '600',
                }}
              >
                {unreadCount > 99 ? '99+' : unreadCount}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const ChatInterface: React.FC = () => {
  const chatData = [
    {
      avatar: '📄',
      name: 'DGI@Placement CSE/AIM...',
      message: 'Anjali: 📎 JD Temp DS 2024 2025.docx',
      time: 'Thursday',
      unreadCount: 2,
    },
    {
      avatar: '📱',
      name: 'WhatsApp',
      message: '🎥 Control who can see your status\nYour status is only visible to your co...',
      time: '6:38 PM',
      unreadCount: 9,
      isOnline: true,
    },
    {
      avatar: 'M',
      name: 'Masaiverse',
      message: 'Hello Pratham Raj Srivastava, Your mentor Mohit Kulkarni, Senior Softw...',
      time: '5:52 PM',
    },
    {
      avatar: '🏢',
      name: 'Thrive Ent',
      message: 'Thrive Ent Unofficial, THRIVE ENT X DELHI, Announcements',
      time: '',
      unreadCount: 99,
    },
    {
      avatar: '👥',
      name: '4 Ps 🤝❤️',
      message: 'Yogi: Hey there, we\'re watching Jolly LLB 3 (UA16+). Find ticket deta...',
      time: '11:32 AM',
    },
    {
      avatar: '👫',
      name: 'Be10X',
      message: 'Reminder: Day-2 of Financial Freedom Accelerator. The FFA Day-...',
      time: 'Yes',
    },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      
      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: scale(16),
          paddingVertical: verticalScale(12),
          backgroundColor: '#000',
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity style={{ marginRight: scale(16) }}>
            <Ionicons name="ellipsis-horizontal" size={scale(24)} color="#fff" />
          </TouchableOpacity>
          <Text
            style={{
              fontSize: scale(28),
              fontWeight: '700',
              color: '#fff',
            }}
          >
            Chats
          </Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity style={{ marginRight: scale(16) }}>
            <Ionicons name="camera-outline" size={scale(24)} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="add" size={scale(28)} color="#25D366" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View
        style={{
          marginHorizontal: scale(16),
          marginBottom: verticalScale(16),
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#1a1a1a',
            borderRadius: scale(20),
            paddingHorizontal: scale(16),
            paddingVertical: verticalScale(10),
          }}
        >
          <Ionicons
            name="search"
            size={scale(20)}
            color="#888"
            style={{ marginRight: scale(8) }}
          />
          <Text
            style={{
              flex: 1,
              fontSize: scale(16),
              color: '#888',
            }}
          >
            Ask Meta AI or Search
          </Text>
        </View>
      </View>

      {/* Filter Tabs */}
      <View
        style={{
          flexDirection: 'row',
          paddingHorizontal: scale(16),
          marginBottom: verticalScale(12),
        }}
      >
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            style={{
              backgroundColor: '#25D366',
              paddingHorizontal: scale(16),
              paddingVertical: verticalScale(8),
              borderRadius: scale(16),
              marginRight: scale(8),
            }}
          >
            <Text style={{ color: '#fff', fontSize: scale(14), fontWeight: '600' }}>
              All
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: '#333',
              paddingHorizontal: scale(16),
              paddingVertical: verticalScale(8),
              borderRadius: scale(16),
              marginRight: scale(8),
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <Text style={{ color: '#fff', fontSize: scale(14) }}>Unread </Text>
            <Text style={{ color: '#888', fontSize: scale(14) }}>195</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: '#333',
              paddingHorizontal: scale(16),
              paddingVertical: verticalScale(8),
              borderRadius: scale(16),
              marginRight: scale(8),
            }}
          >
            <Text style={{ color: '#fff', fontSize: scale(14) }}>Favourites</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: '#333',
              paddingHorizontal: scale(16),
              paddingVertical: verticalScale(8),
              borderRadius: scale(16),
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <Text style={{ color: '#fff', fontSize: scale(14) }}>Groups </Text>
            <Text style={{ color: '#888', fontSize: scale(14) }}>54</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Archived */}
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: scale(16),
          paddingVertical: verticalScale(12),
        }}
      >
        <MaterialIcons
          name="archive"
          size={scale(24)}
          color="#888"
          style={{ marginRight: scale(16) }}
        />
        <Text style={{ fontSize: scale(16), color: '#888' }}>Archived</Text>
      </TouchableOpacity>

      {/* Chat List */}
      <ScrollView style={{ flex: 1 }}>
        {chatData.map((chat, index) => (
          <ChatItem
            key={index}
            avatar={chat.avatar}
            name={chat.name}
            message={chat.message}
            time={chat.time}
            unreadCount={chat.unreadCount}
            isOnline={chat.isOnline}
          />
        ))}
      </ScrollView>

      {/* Bottom Navigation */}
      <View
        style={{
          flexDirection: 'row',
          backgroundColor: '#000',
          paddingVertical: verticalScale(12),
          paddingHorizontal: scale(16),
          borderTopWidth: 1,
          borderTopColor: '#333',
        }}
      >
        <TouchableOpacity
          style={{
            flex: 1,
            alignItems: 'center',
            position: 'relative',
          }}
        >
          <Ionicons name="sync-outline" size={scale(24)} color="#888" />
          <Text style={{ fontSize: scale(10), color: '#888', marginTop: verticalScale(4) }}>
            Updates
          </Text>
          <View
            style={{
              position: 'absolute',
              top: -2,
              right: '35%',
              backgroundColor: '#25D366',
              borderRadius: scale(8),
              minWidth: scale(16),
              height: scale(16),
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text style={{ color: '#fff', fontSize: scale(10), fontWeight: '600' }}>
              5
            </Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity style={{ flex: 1, alignItems: 'center' }}>
          <Ionicons name="call-outline" size={scale(24)} color="#888" />
          <Text style={{ fontSize: scale(10), color: '#888', marginTop: verticalScale(4) }}>
            Calls
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={{ flex: 1, alignItems: 'center' }}>
          <Ionicons name="people-outline" size={scale(24)} color="#888" />
          <Text style={{ fontSize: scale(10), color: '#888', marginTop: verticalScale(4) }}>
            Communities
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={{
            flex: 1,
            alignItems: 'center',
            position: 'relative',
          }}
        >
          <Ionicons name="chatbubbles" size={scale(24)} color="#25D366" />
          <Text style={{ fontSize: scale(10), color: '#25D366', marginTop: verticalScale(4) }}>
            Chats
          </Text>
          <View
            style={{
              position: 'absolute',
              top: -2,
              right: '20%',
              backgroundColor: '#25D366',
              borderRadius: scale(10),
              minWidth: scale(20),
              height: scale(20),
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text style={{ color: '#fff', fontSize: scale(11), fontWeight: '600' }}>
              195
            </Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={{
            flex: 1,
            alignItems: 'center',
            position: 'relative',
          }}
        >
          <Ionicons name="settings-outline" size={scale(24)} color="#888" />
          <Text style={{ fontSize: scale(10), color: '#888', marginTop: verticalScale(4) }}>
            Settings
          </Text>
          <View
            style={{
              position: 'absolute',
              top: -2,
              right: '25%',
              backgroundColor: '#25D366',
              borderRadius: scale(6),
              width: scale(12),
              height: scale(12),
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text style={{ color: '#fff', fontSize: scale(8), fontWeight: '600' }}>
              1
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ChatInterface;