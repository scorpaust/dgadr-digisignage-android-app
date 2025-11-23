import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { useNewsletters } from "../utils/useNewsletters";
import NewsletterHighlightCard from "../components/newsletters/NewsletterHighlightCard";
import NewsletterHistoryItem from "../components/newsletters/NewsletterHistoryItem";
import NewsletterCoverModal from "../components/newsletters/NewsletterCoverModal";
import { NewsletterCollection, NewsletterIssue } from "../types/newsletter";
import { firebase } from "../config";
import { getDownloadURL, getStorage, ref } from "firebase/storage";
import { FirebaseError } from "firebase/app";
import InfoModal from "../components/InfoModal";

const windowWidth = Dimensions.get("window").width;
const scaleFactor = windowWidth / 320;

type Highlight = {
  issue: NewsletterIssue;
  category: NewsletterCollection;
};

const NewslettersScreen: React.FC = () => {
  const {
    newsletters,
    loading: newslettersLoading,
    error: newslettersError,
  } = useNewsletters();
  const [coverUrls, setCoverUrls] = useState<Record<string, string>>({});
  const [error, setError] = useState<FirebaseError | undefined>(undefined);
  const [preview, setPreview] = useState<{
    issue: NewsletterIssue;
    category: NewsletterCollection;
  } | null>(null);

  const issuesWithCoverPath = useMemo(
    () =>
      newsletters.flatMap((collection) =>
        collection.issues
          .filter((issue) => Boolean(issue.coverImagePath))
          .map((issue) => ({
            id: issue.id,
            path: issue.coverImagePath as string,
          }))
      ),
    [newsletters]
  );

  const fetchCoverImages = useCallback(async () => {
    setError(undefined);
    try {
      const storage = getStorage(
        firebase,
        "gs://dgadr-digisignage-app.appspot.com"
      );

      const entries = await Promise.all(
        issuesWithCoverPath.map(async ({ id, path }) => {
          try {
            const downloadUrl = await getDownloadURL(ref(storage, path));
            return [id, downloadUrl] as const;
          } catch (coverError) {
            if (coverError instanceof FirebaseError) {
              setError(coverError);
            }
            // Erro silencioso
            return null;
          }
        })
      );

      const validEntries = entries.filter(
        (entry): entry is readonly [string, string] => Boolean(entry)
      );

      setCoverUrls(Object.fromEntries(validEntries));
    } catch (storageError) {
      if (storageError instanceof FirebaseError) {
        setError(storageError);
      }
      // Erro silencioso
    }
  }, [issuesWithCoverPath]);

  useEffect(() => {
    fetchCoverImages();
  }, [fetchCoverImages]);

  const handleCloseModal = useCallback(() => setError(undefined), []);
  const handleClosePreview = useCallback(() => setPreview(null), []);

  const highlights = useMemo<Highlight[]>(() => {
    return newsletters.reduce<Highlight[]>((acc, collection) => {
      if (!collection.issues.length) {
        return acc;
      }

      const sortedIssues = [...collection.issues].sort(
        (a, b) =>
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );

      acc.push({ issue: sortedIssues[0], category: collection });
      return acc;
    }, []);
  }, [newsletters]);

  const history = useMemo(() => {
    return newsletters
      .flatMap((collection) =>
        collection.issues.map((issue) => ({ issue, category: collection }))
      )
      .sort(
        (a, b) =>
          new Date(b.issue.publishedAt).getTime() -
          new Date(a.issue.publishedAt).getTime()
      );
  }, [newsletters]);

  const previewCoverUri = preview ? coverUrls[preview.issue.id] : undefined;

  // Show loading state
  if (newslettersLoading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#3F51B5" />
        <Text style={styles.loadingText}>A carregar newsletters...</Text>
      </View>
    );
  }

  // Show error state
  if (newslettersError) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>Erro ao carregar newsletters</Text>
        <Text style={styles.errorSubtext}>{newslettersError}</Text>
      </View>
    );
  }

  return (
    <>
      {error ? <InfoModal info={error} onClose={handleCloseModal} /> : null}
      {preview && previewCoverUri ? (
        <NewsletterCoverModal
          visible
          coverUri={previewCoverUri}
          title={preview.issue.title}
          categoryName={preview.category.name}
          publishedAt={new Date(preview.issue.publishedAt).toLocaleDateString(
            "pt-PT",
            {
              day: "2-digit",
              month: "long",
              year: "numeric",
            }
          )}
          onClose={handleClosePreview}
        />
      ) : null}
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Destaques</Text>
          <Text style={styles.sectionSubtitle}>
            Fique a par das últimas edições de cada newsletter da DGADR.
          </Text>
          <View style={styles.highlightsWrapper}>
            {highlights.map(({ issue, category }) => (
              <NewsletterHighlightCard
                key={issue.id}
                issue={issue}
                categoryName={category.name}
                accentColor={category.color}
                coverImageUri={coverUrls[issue.id]}
                onPress={
                  coverUrls[issue.id]
                    ? () => setPreview({ issue, category })
                    : undefined
                }
              />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Histórico</Text>
          <Text style={styles.sectionSubtitle}>
            Consulte e recupere todas as edições anteriores publicadas.
          </Text>
          <View style={styles.historyWrapper}>
            {history.map(({ issue, category }) => (
              <NewsletterHistoryItem
                key={issue.id}
                issue={issue}
                categoryName={category.name}
                accentColor={category.color}
                coverImageUri={coverUrls[issue.id]}
                onPress={
                  coverUrls[issue.id]
                    ? () => setPreview({ issue, category })
                    : undefined
                }
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7fa",
  },
  contentContainer: {
    paddingHorizontal: 20 * scaleFactor,
    paddingVertical: 24 * scaleFactor,
  },
  section: {
    marginBottom: 32 * scaleFactor,
  },
  sectionTitle: {
    fontSize: 22 * scaleFactor,
    fontWeight: "700",
    color: "#102a43",
  },
  sectionSubtitle: {
    marginTop: 6 * scaleFactor,
    fontSize: 14 * scaleFactor,
    color: "#52606d",
  },
  highlightsWrapper: {
    marginTop: 20 * scaleFactor,
  },
  historyWrapper: {
    marginTop: 16 * scaleFactor,
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#52606d",
  },
  errorText: {
    fontSize: 18 * scaleFactor,
    fontWeight: "600",
    color: "#e53e3e",
    textAlign: "center",
  },
  errorSubtext: {
    marginTop: 8 * scaleFactor,
    fontSize: 14 * scaleFactor,
    color: "#52606d",
    textAlign: "center",
  },
});

export default NewslettersScreen;
