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

const priorityColors = {
  KORKEA: "#ef4444",
  KESKITASO: "#f59e0b",
  MATALA: "#10b981",
};

const priorityLabels = {
  KORKEA: "Korkea",
  KESKITASO: "Keskitaso",
  MATALA: "Matala",
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
        const message = error?.response?.data?.message || "Tikettien haku epäonnistui";
        Alert.alert("Virhe", message);
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
        "Kommenttien haku epäonnistui";
      Alert.alert("Virhe", message);
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
        "Kommentin luonti epäonnistui";
      Alert.alert("Virhe", message);
    } finally {
      setPostingComment(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.mutedText}>Ladataan tiketteja...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Omat tiketit</Text>
      {tickets.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>Ei tikettejä vielä</Text>
          <Text style={styles.emptyText}>
            Luo uusi tiketti aloittaaksesi.
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
                Tila: {statusLabels[item.status] || item.status || "-"}
              </Text>
              <View style={styles.metaRow}>
                <Text style={styles.cardMeta}>Prioriteetti:</Text>
                <View
                  style={[
                    styles.priorityBadge,
                    {
                      backgroundColor:
                        priorityColors[item.priority] || "#334155",
                    },
                  ]}
                >
                  <Text style={styles.priorityBadgeText}>
                    {priorityLabels[item.priority] || item.priority || "-"}
                  </Text>
                </View>
              </View>
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
              <Text style={styles.closeButton}>Sulje</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.cardMeta}>
            Tila: {statusLabels[selectedTicket?.status] || "-"}
          </Text>
          <View style={styles.metaRow}>
            <Text style={styles.cardMeta}>Prioriteetti:</Text>
            <View
              style={[
                styles.priorityBadge,
                {
                  backgroundColor:
                    priorityColors[selectedTicket?.priority] || "#334155",
                },
              ]}
            >
              <Text style={styles.priorityBadgeText}>
                {priorityLabels[selectedTicket?.priority] ||
                  selectedTicket?.priority ||
                  "-"}
              </Text>
            </View>
          </View>
          <Text style={styles.modalText}>{selectedTicket?.description}</Text>

          <Text style={styles.sectionTitle}>Kommentit</Text>
          {commentsLoading ? (
            <ActivityIndicator size="small" color="#2563eb" />
          ) : comments.length === 0 ? (
            <Text style={styles.mutedText}>Ei kommentteja vielä.</Text>
          ) : (
            comments.map((comment) => (
              <View key={comment.id} style={styles.commentCard}>
                <Text style={styles.commentAuthor}>
                  {comment.user?.name || "Käyttäjä"}
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
              placeholder="Lisää kommentti"
              placeholderTextColor="#94a3b8"
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
                {postingComment ? "Tallennetaan..." : "Lisää kommentti"}
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
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  priorityBadge: {
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 6,
  },
  priorityBadgeText: {
    color: "#0b1120",
    fontSize: 12,
    fontWeight: "700",
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
