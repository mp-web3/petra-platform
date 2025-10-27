import { Box, Code, Heading, Link, Text } from '@chakra-ui/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownProps {
    children: string;
}

export default function Markdown({ children }: MarkdownProps) {
    return (
        <Box>
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    h1: ({ children }) => (
                        <Heading as="h1" size="lg" mt={4} mb={2}>
                            {children}
                        </Heading>
                    ),
                    h2: ({ children }) => (
                        <Heading as="h2" size="md" mt={4} mb={2}>
                            {children}
                        </Heading>
                    ),
                    h3: ({ children }) => (
                        <Heading as="h3" size="sm" mt={3} mb={2}>
                            {children}
                        </Heading>
                    ),
                    p: ({ children }) => <Text my={2}>{children}</Text>,
                    ul: ({ children }) => (
                        <Box as="ul" my={2} pl={6} style={{ listStyleType: 'disc' }}>
                            {children}
                        </Box>
                    ),
                    ol: ({ children }) => (
                        <Box as="ol" my={2} pl={6} style={{ listStyleType: 'decimal' }}>
                            {children}
                        </Box>
                    ),
                    li: ({ children }) => (
                        <Box as="li" my={1}>
                            {children}
                        </Box>
                    ),
                    a: ({ href, children }) => (
                        <Link href={href} target="_blank" rel="noreferrer" color="text.link">
                            {children}
                        </Link>
                    ),
                    code: ({ children }) => <Code>{children}</Code>,
                }}
            >
                {children}
            </ReactMarkdown>
        </Box>
    );
}

