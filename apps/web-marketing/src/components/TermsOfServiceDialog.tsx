'use client';

import {
    Box,
    Button,
    Checkbox,
    CloseButton,
    Dialog,
    Text,
    HStack,
    Spinner,
} from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { fetchLegalMarkdown, CURRENT_TERMS_VERSION } from '@/lib/legal';
import Markdown from '@/components/Markdown';

type Props = {
    onAccept?: (version: string) => void;
    checked?: boolean;
    onChange?: (next: boolean, version: string) => void;
};

export default function TermsOfServiceDialog({
    onAccept,
    checked = false,
    onChange,
}: Props) {
    const [open, setOpen] = useState(false);
    const [content, setContent] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [loadError, setLoadError] = useState<string | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    async function load() {
        setLoading(true);
        setLoadError(null);
        try {
            const md = await fetchLegalMarkdown('terms', CURRENT_TERMS_VERSION);
            setContent(md);
        } catch (e: any) {
            setLoadError('Impossibile caricare i Termini di Servizio. Riprova.');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (!open) return;
        load();
    }, [open]);

    // Reset scroll position on open/content change for a consistent start
    useEffect(() => {
        if (!open) return;
        const el = scrollRef.current;
        if (el) el.scrollTop = 0;
    }, [open, content]);

    return (
        <Dialog.Root
            onOpenChange={(e) => setOpen(e.open)}
            size={{ base: 'cover', md: 'full' }}
            open={open}
            scrollBehavior="inside"
        >
            <Dialog.Trigger asChild>
                <Button variant="plain">Apri i termini di servizio</Button>
            </Dialog.Trigger>
            <Dialog.Backdrop />
            <Dialog.Positioner>
                <Dialog.Content maxH="90vh" w={{ base: '100%', md: '90%', lg: '800px' }}>
                    <Dialog.Header>
                        <Dialog.Title>Termini di servizio e trattamento dei dati</Dialog.Title>
                    </Dialog.Header>
                    <Dialog.CloseTrigger asChild>
                        <CloseButton size="sm" />
                    </Dialog.CloseTrigger>
                    <Dialog.Body display="flex" flexDirection="column" maxH="calc(90vh - 120px)" overflow="hidden">
                        {loading ? (
                            <Box display="flex" alignItems="center" justifyContent="center" flex="1">
                                <Spinner />
                            </Box>
                        ) : loadError ? (
                            <Box
                                display="flex"
                                flexDirection="column"
                                alignItems="center"
                                justifyContent="center"
                                gap={3}
                                flex="1"
                            >
                                <Text role="alert">{loadError}</Text>
                                <Button onClick={load}>Riprova</Button>
                            </Box>
                        ) : (
                            <>
                                <HStack justify="space-between" mb={2}>
                                    <Text color="text.muted" fontSize="sm">
                                        Scorri per leggere
                                    </Text>
                                    <Button variant="plain" asChild>
                                        <a href="/terms" target="_blank" rel="noreferrer">
                                            Apri in una nuova scheda
                                        </a>
                                    </Button>
                                </HStack>
                                <Box
                                    ref={scrollRef}
                                    role="region"
                                    aria-label="Contenuto dei Termini di Servizio"
                                    tabIndex={0}
                                    flex="1"
                                    overflowY="auto"
                                    px={2}
                                    py={2}
                                    borderWidth="1px"
                                    borderRadius="md"
                                    borderColor="border.subtle"
                                >
                                    <Markdown>{content}</Markdown>

                                    <Box mt={4} pt={3} borderTopWidth="1px" borderColor="border.subtle">
                                        <Checkbox.Root
                                            checked={checked}
                                            onCheckedChange={(e) => {
                                                const next = e.checked === true;
                                                onChange?.(next, CURRENT_TERMS_VERSION);
                                                if (next) {
                                                    onAccept?.(CURRENT_TERMS_VERSION);
                                                    setOpen(false);
                                                }
                                            }}
                                        >
                                            <Checkbox.Control />
                                            <Checkbox.Label>
                                                Confermo di aver letto, di aver compreso e di accettare i termini di
                                                servizio
                                            </Checkbox.Label>
                                            <Checkbox.HiddenInput />
                                        </Checkbox.Root>
                                    </Box>
                                </Box>
                            </>
                        )}
                    </Dialog.Body>
                </Dialog.Content>
            </Dialog.Positioner>
        </Dialog.Root>
    );
}

