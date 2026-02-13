import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";

const tabs = [
  {
    id: "password",
    title: "Miten vaihdan salasanan?",
    summary: "Vaihda se profiilin asetuksista.",
  },
  {
    id: "login",
    title: "En pysty kirjautumaan",
    summary: "Tarkista tunnukset tai nollaa salasana.",
  },
  {
    id: "locked",
    title: "Tilini on lukittu",
    summary: "Liian monet virheelliset yritykset voivat lukita tilin.",
  },
  {
    id: "verification",
    title: "Miksi sain vahvistuspyynnön?",
    summary: "Ilmoitamme, kun kirjautuminen havaitaan uudella laitteella.",
  },
  {
    id: "security",
    title: "Miten tietojani suojataan?",
    summary: "Käytämme vahvaa salausta ja lokituskäytäntöjä.",
  },
];

const passwordSteps = [
  "Kirjaudu nykyisillä tunnuksillasi.",
  "Avaa profiilivalikko.",
  "Valitse Asetukset ja sitten Vaihda salasana.",
  "Syötä nykyinen salasana ja luo uusi.",
  "Vahvista ja tallenna.",
  "Kirjaudu uudelleen, jos pyydetään.",
];

const securityTips = [
  {
    title: "Vahva salasana",
    text: "Käytä vähintään 12 merkkiä, joissa on isoja ja pieniä kirjaimia, numeroita ja symboleja.",
  },
  {
    title: "Vältä uudelleenkäyttöä",
    text: "Älä käytä samaa salasanaa eri palveluissa.",
  },
  {
    title: "Tietojenkalastelu",
    text: "Vältä epäileviä linkkejä ja varmista lähettäjän osoite.",
  },
  {
    title: "Lukitus",
    text: "Käytä automaattista lukitusta ja päivitä käyttöjärjestelmä säännöllisesti.",
  },
  {
    title: "Ilmoitukset",
    text: "Jos saat epäilevän kirjautumisilmoituksen, vaihda salasana heti.",
  },
  {
    title: "Tietojen kasittely",
    text: "Tukitiketit käsitellään luottamuksellisesti vain valtuutetun henkilön toimesta.",
  },
];

export default function FAQ() {
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  const activeItem = tabs.find((item) => item.id === activeTab);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>FAQ</Text>
      <Text style={styles.subtitle}>Tietoturva- ja tukiopas</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tietoturvavinkit</Text>
        {securityTips.map((tip) => (
          <View key={tip.title} style={styles.card}>
            <Text style={styles.cardTitle}>{tip.title}</Text>
            <Text style={styles.cardText}>{tip.text}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Yleiset kysymykset</Text>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={
              activeTab === tab.id
                ? [styles.tabButton, styles.tabButtonActive]
                : styles.tabButton
            }
            onPress={() => setActiveTab(tab.id)}
          >
            <Text style={styles.tabTitle}>{tab.title}</Text>
            <Text style={styles.tabSummary}>{tab.summary}</Text>
          </TouchableOpacity>
        ))}

        {activeItem ? (
          <View style={styles.panel}>
            <Text style={styles.panelTitle}>{activeItem.title}</Text>
            <Text style={styles.panelText}>{activeItem.summary}</Text>
            {activeTab === "login" ? (
              <View style={styles.panelList}>
                <Text style={styles.panelItem}>1. Varmista, ettei Caps Lock ole päällä.</Text>
                <Text style={styles.panelItem}>2. Kokeile salasanan nollausta.</Text>
                <Text style={styles.panelItem}>3. Ota yhteys tukeen, jos ongelma jatkuu.</Text>
              </View>
            ) : null}
            {activeTab === "password" ? (
              <View style={styles.panelList}>
                {passwordSteps.map((step, index) => (
                  <Text key={step} style={styles.panelItem}>
                    {index + 1}. {step}
                  </Text>
                ))}
              </View>
            ) : null}
            {activeTab === "locked" ? (
              <View style={styles.panelList}>
                <Text style={styles.panelItem}>1. Odota 10 minuuttia ennen uutta yritystä.</Text>
                <Text style={styles.panelItem}>2. Pyydä ylläpitoa avaamaan tili tarvittaessa.</Text>
                <Text style={styles.panelItem}>3. Tarkista käyttäjätunnus.</Text>
              </View>
            ) : null}
            {activeTab === "verification" ? (
              <View style={styles.panelList}>
                <Text style={styles.panelItem}>1. Hyväksy vain, jos se olit sinä.</Text>
                <Text style={styles.panelItem}>2. Hylkää ja vaihda salasana, jos et ollut.</Text>
                <Text style={styles.panelItem}>3. Ilmoita tuelle jatkoselvitystä varten.</Text>
              </View>
            ) : null}
            {activeTab === "security" ? (
              <View style={styles.panelList}>
                <Text style={styles.panelItem}>1. Istunnot lokitetaan ja valvotaan.</Text>
                <Text style={styles.panelItem}>2. Pääsy on rajattu henkilöstölle.</Text>
                <Text style={styles.panelItem}>3. Varmistus takaa jatkuvuuden.</Text>
              </View>
            ) : null}
          </View>
        ) : null}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#0f172a",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#f8fafc",
    marginBottom: 6,
  },
  subtitle: {
    color: "#94a3b8",
    marginBottom: 16,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    color: "#f8fafc",
    fontWeight: "600",
    marginBottom: 10,
  },
  card: {
    backgroundColor: "#111827",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  cardTitle: {
    color: "#f8fafc",
    fontWeight: "600",
    marginBottom: 4,
  },
  cardText: {
    color: "#94a3b8",
  },
  tabButton: {
    backgroundColor: "#111827",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  tabButtonActive: {
    borderColor: "#2563eb",
    borderWidth: 1,
  },
  tabTitle: {
    color: "#f8fafc",
    fontWeight: "600",
  },
  tabSummary: {
    color: "#94a3b8",
    marginTop: 4,
  },
  panel: {
    backgroundColor: "#111827",
    padding: 12,
    borderRadius: 10,
  },
  panelTitle: {
    color: "#f8fafc",
    fontWeight: "600",
    marginBottom: 6,
  },
  panelText: {
    color: "#94a3b8",
    marginBottom: 6,
  },
  panelList: {
    marginTop: 6,
  },
  panelItem: {
    color: "#e2e8f0",
    marginBottom: 4,
  },
});
