'use client';

import { Box, Container, Heading, Spinner, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { fetchLegalMarkdown, CURRENT_PRIVACY_VERSION } from '@/lib/legal';
import { Markdown } from '@/components';

export default function PrivacyPolicyPage() {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const md = await fetchLegalMarkdown('privacy', CURRENT_PRIVACY_VERSION);
        setContent(md);
      } catch (e: any) {
        setError('Impossibile caricare l\'Informativa sulla Privacy. Riprova più tardi.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <Box pt={20} bg="surface.page" minH="100vh">
      <Container maxW="container.md" px={[4, 6, 8]} py={[16, 20, 24]}>
        {loading ? (
          <Box display="flex" justifyContent="center" py={12}>
            <Spinner size="lg" />
          </Box>
        ) : error ? (
          <Box display="flex" flexDirection="column" alignItems="center" gap={3} py={12}>
            <Text role="alert" color="status.error">
              {error}
            </Text>
          </Box>
        ) : (
          <>
            <Heading as="h1" textStyle="h2" color="heading.onPage" mb={8}>
              Informativa sulla Privacy
            </Heading>
            <Markdown>{content}</Markdown>
          </>
        )}
      </Container>
    </Box>
  );
}

