import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  TextInput,
} from "react-native";
import api from "./api";

const statusActions = [
  { label: "Avoin", value: "Avoin" },
  { label: "Kasittelyssa", value: "Käsittelyssä" },
  { label: "Ratkaistu", value: "Ratkaistu" },
];

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

export default function AdminDashboard() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [postingComment, setPostingComment] = useState(false);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await api.get("/tickets/gettickets");
        setTickets(res.data || []);
      } catch (error) {
        const message = error?.response?.data?.message || "Tikettien haku epäonnistui";
        Alert.alert("Virhe", message);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  const changeStatus = async (id, newStatus) => {
    try {
      const res = await api.put(`/tickets/update/${id}`, {
        status: newStatus,
      });
      setTickets((prev) => prev.map((t) => (t.id === id ? res.data : t)));
    } catch (error) {
      const message = error?.response?.data?.message || "Tilan päivitys epäonnistui";
      Alert.alert("Virhe", message);
    }
  };

  const confirmDeleteTicket = (id) => {
    Alert.alert("Vahvista", "Poistetaanko tiketti?", [
      { text: "Peruuta", style: "cancel" },
      {
        text: "Poista",
        style: "destructive",
        onPress: () => deleteTicket(id),
      },
    ]);
  };

  const deleteTicket = async (id) => {
    try {
      await api.delete(`/tickets/delete/${id}`);
      setTickets((prev) => prev.filter((t) => t.id !== id));
    } catch (error) {
      const message = error?.response?.data?.message || "Poisto epäonnistui";
      Alert.alert("Virhe", message);
    }
  };

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

  const confirmDeleteComment = (commentId) => {
    Alert.alert("Vahvista", "Poistetaanko kommentti?", [
      { text: "Peruuta", style: "cancel" },
      {
        text: "Poista",
        style: "destructive",
        onPress: () => deleteComment(commentId),
      },
    ]);
  };

  const deleteComment = async (commentId) => {
    if (!selectedTicket) return;
    try {
      await api.delete(
        `/tickets/${selectedTicket.id}/deletecomment/${commentId}`
      );
      await loadComments(selectedTicket.id);
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Kommentin poisto epäonnistui";
      Alert.alert("Virhe", message);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#dc2626" />
        <Text style={styles.mutedText}>Ladataan tikettejä...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.adminHeader}>
        <Text style={styles.adminTitle}>🔐 Ylläpidon tiketti paneeli</Text>
        <Text style={styles.adminSubtitle}>Kaikki luodut tiketit löytyvät täältä</Text>
      </View>
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
            <Text style={styles.cardMeta}>Tila: {item.status}</Text>
            <Text style={styles.cardMeta}>Käyttäjä: {item.user?.name}</Text>
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
            <View style={styles.statusRow}>
              {statusActions.map((status) => (
                <TouchableOpacity
                  key={status.value}
                  style={styles.statusButton}
                  onPress={() => changeStatus(item.id, status.value)}
                >
                  <Text style={styles.statusButtonText}>{status.label}</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={[styles.statusButton, styles.deleteButton]}
                onPress={() => confirmDeleteTicket(item.id)}
              >
                <Text style={styles.statusButtonText}>Poista</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
      />

      <Modal visible={Boolean(selectedTicket)} animationType="slide">
        <ScrollView style={styles.modalScroll} contentContainerStyle={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{selectedTicket?.title}</Text>
            <TouchableOpacity onPress={handleCloseDetails}>
              <Text style={styles.closeButton}>Sulje</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.cardMeta}>Tila: {selectedTicket?.status}</Text>
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
                <TouchableOpacity
                  style={styles.commentDelete}
                  onPress={() => confirmDeleteComment(comment.id)}
                >
                  <Text style={styles.commentDeleteText}>Poista</Text>
                </TouchableOpacity>
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
    backgroundColor: "#1a1a2e",
    paddingHorizontal: 16,
    paddingTop: 32,
  },
  adminHeader: {
    backgroundColor: "#dc2626",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  adminTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: 4,
  },
  adminSubtitle: {
    fontSize: 13,
    color: "#fecaca",
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
  statusRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
  },
  statusButton: {
    backgroundColor: "#1f2937",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  statusButtonText: {
    color: "#e2e8f0",
    fontWeight: "600",
    fontSize: 12,
  },
  deleteButton: {
    backgroundColor: "#b91c1c",
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
  modalScroll: {
    flex: 1,
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
  commentDelete: {
    marginTop: 8,
  },
  commentDeleteText: {
    color: "#f87171",
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
