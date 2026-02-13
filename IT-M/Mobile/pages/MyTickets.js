import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  TextInput,
  Alert,
  ScrollView,
} from "react-native";
import api from "./api";

const statusLabels = {
  AVOIN: "Avoin",
  KASITTELYSSA: "Kasittelyssa",
  RATKAISTU: "Ratkaistu",
};

export default function MyTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [postingComment, setPostingComment] = useState(false);

  useEffect(() => {
    const fetchMyTickets = async () => {
      try {
        const res = await api.get("/tickets/my");
        setTickets(res.data || []);
      } catch (error) {
        const message = error?.response?.data?.message || "Ticket fetch failed";
        Alert.alert("Error", message);
      } finally {
        setLoading(false);
      }
    };

    fetchMyTickets();
  }, []);

  const loadComments = async (ticketId) => {
    setCommentsLoading(true);
    try {
      const res = await api.get(`/tickets/${ticketId}/getcomment`);
      setComments(res.data || []);
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Comment fetch failed";
      Alert.alert("Error", message);
    } finally {
      setCommentsLoading(false);
    }
  };

  const handleSelectTicket = (ticket) => {
    setSelectedTicket(ticket);
    loadComments(ticket.id);
  };

  const handleCloseDetails = () => {
    setSelectedTicket(null);
    setComments([]);
    setCommentText("");
  };

  const handleAddComment = async () => {
    if (!selectedTicket || !commentText.trim()) return;

    setPostingComment(true);
    try {
      await api.post(`/tickets/${selectedTicket.id}/createcomment`, {
        content: commentText.trim(),
      });
      setCommentText("");
      await loadComments(selectedTicket.id);
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Comment create failed";
      Alert.alert("Error", message);
    } finally {
      setPostingComment(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.mutedText}>Loading tickets...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My tickets</Text>
      {tickets.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No tickets yet</Text>
          <Text style={styles.emptyText}>
            Create a new ticket to get started.
          </Text>
        </View>
      ) : (
        <FlatList
          data={tickets}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => handleSelectTicket(item)}
            >
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardMeta}>
                Status: {statusLabels[item.status] || item.status || "-"}
              </Text>
              <Text style={styles.cardMeta}>
                Priority: {item.priority || "-"}
              </Text>
              <Text style={styles.cardText} numberOfLines={2}>
                {item.description}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}

      <Modal visible={Boolean(selectedTicket)} animationType="slide">
        <ScrollView contentContainerStyle={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{selectedTicket?.title}</Text>
            <TouchableOpacity onPress={handleCloseDetails}>
              <Text style={styles.closeButton}>Close</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.cardMeta}>
            Status: {statusLabels[selectedTicket?.status] || "-"}
          </Text>
          <Text style={styles.cardMeta}>
            Priority: {selectedTicket?.priority || "-"}
          </Text>
          <Text style={styles.modalText}>{selectedTicket?.description}</Text>

          <Text style={styles.sectionTitle}>Comments</Text>
          {commentsLoading ? (
            <ActivityIndicator size="small" color="#2563eb" />
          ) : comments.length === 0 ? (
            <Text style={styles.mutedText}>No comments yet.</Text>
          ) : (
            comments.map((comment) => (
              <View key={comment.id} style={styles.commentCard}>
                <Text style={styles.commentAuthor}>
                  {comment.user?.name || "User"}
                </Text>
                <Text style={styles.commentDate}>
                  {comment.createdAt
                    ? new Date(comment.createdAt).toLocaleString()
                    : ""}
                </Text>
                <Text style={styles.commentText}>{comment.content}</Text>
              </View>
            ))
          )}

          <View style={styles.commentForm}>
            <TextInput
              style={styles.commentInput}
              placeholder="Add a comment"
              value={commentText}
              onChangeText={setCommentText}
              multiline
            />
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleAddComment}
              disabled={postingComment || !commentText.trim()}
            >
              <Text style={styles.primaryButtonText}>
                {postingComment ? "Saving..." : "Add comment"}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#f8fafc",
    marginBottom: 12,
  },
  list: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: "#111827",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  cardTitle: {
    color: "#f8fafc",
    fontWeight: "600",
    fontSize: 16,
    marginBottom: 6,
  },
  cardMeta: {
    color: "#94a3b8",
    fontSize: 12,
  },
  cardText: {
    color: "#e2e8f0",
    marginTop: 8,
  },
  emptyState: {
    backgroundColor: "#111827",
    borderRadius: 12,
    padding: 16,
  },
  emptyTitle: {
    color: "#f8fafc",
    fontWeight: "600",
    marginBottom: 6,
  },
  emptyText: {
    color: "#94a3b8",
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0f172a",
  },
  mutedText: {
    color: "#94a3b8",
    marginTop: 8,
  },
  modalContainer: {
    padding: 16,
    backgroundColor: "#0f172a",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  modalTitle: {
    color: "#f8fafc",
    fontSize: 20,
    fontWeight: "700",
  },
  closeButton: {
    color: "#f87171",
    fontWeight: "600",
  },
  modalText: {
    color: "#e2e8f0",
    marginTop: 10,
    marginBottom: 16,
  },
  sectionTitle: {
    color: "#f8fafc",
    fontWeight: "600",
    marginBottom: 8,
  },
  commentCard: {
    backgroundColor: "#111827",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  commentAuthor: {
    color: "#f8fafc",
    fontWeight: "600",
  },
  commentDate: {
    color: "#94a3b8",
    fontSize: 12,
  },
  commentText: {
    color: "#e2e8f0",
    marginTop: 6,
  },
  commentForm: {
    marginTop: 12,
  },
  commentInput: {
    backgroundColor: "#111827",
    borderRadius: 10,
    padding: 12,
    minHeight: 80,
    color: "#f8fafc",
    marginBottom: 10,
  },
  primaryButton: {
    backgroundColor: "#2563eb",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "white",
    fontWeight: "600",
  },
});
