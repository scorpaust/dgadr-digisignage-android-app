import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, View, Dimensions } from "react-native";
import { NEWSLETTER_COLLECTIONS } from "../data/newsletters";
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
  const [coverUrls, setCoverUrls] = useState<Record<string, string>>({});
  const [error, setError] = useState<FirebaseError | undefined>(undefined);
  const [preview, setPreview] = useState<{
    issue: NewsletterIssue;
    category: NewsletterCollection;
  } | null>(null);

  const issuesWithCoverPath = useMemo(
    () =>
      NEWSLETTER_COLLECTIONS.flatMap((collection) =>
        collection.issues
          .filter((issue) => Boolean(issue.coverImagePath))
          .map((issue) => ({
            id: issue.id,
            path: issue.coverImagePath as string,
          }))
      ),
    []
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
            console.error(
              `[Newsletters] Falha ao obter a capa da newsletter ${id} (${path}).`,
              coverError
            );
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
      console.error(
        "[Newsletters] Erro inesperado a carregar capas.",
        storageError
      );
    }
  }, [issuesWithCoverPath]);

  useEffect(() => {
    fetchCoverImages();
  }, [fetchCoverImages]);

  const handleCloseModal = useCallback(() => setError(undefined), []);
  const handleClosePreview = useCallback(() => setPreview(null), []);

  const highlights = useMemo<Highlight[]>(() => {
    return NEWSLETTER_COLLECTIONS.reduce<Highlight[]>((acc, collection) => {
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
  }, []);

  const history = useMemo(() => {
    return NEWSLETTER_COLLECTIONS.flatMap((collection) =>
      collection.issues.map((issue) => ({ issue, category: collection }))
    ).sort(
      (a, b) =>
        new Date(b.issue.publishedAt).getTime() -
        new Date(a.issue.publishedAt).getTime()
    );
  }, []);

  const previewCoverUri = preview ? coverUrls[preview.issue.id] : undefined;

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
});

export default NewslettersScreen;
