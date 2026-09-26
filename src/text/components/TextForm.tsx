import React, {
  FormEvent,
  ChangeEvent,
  useEffect,
  useState,
  useRef,
} from 'react';
import { Button, IconButton } from '../../common/atoms/Button';
import { Form as FormBase } from '../../common/atoms/Form';
import { useNotification } from '../../common/hooks';
import { useText } from '../services/useText';
import { Alert } from '../../common/atoms/Alert';
import { Textarea } from '../../common/atoms/Textarea';
import { Details } from '../../common/atoms/Details';
import { Summary } from '../../common/atoms/Summary';
import { InfoText } from '../../common/atoms/InfoText';
import { FilterManager } from './FilterManager';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faXmark } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';

export type TextFormProps = {
  onSubmit: (text: string, filter: string[]) => void;
  loading: boolean;
};

const Form = styled(FormBase)`
  gap: 1rem;
  width: 100%;
  max-width: 640px;
`;

const Toolbar = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
`;

const Actions = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-left: auto;
`;

const Modal = styled.div<{ $isOpen: boolean }>`
  display: ${({ $isOpen }: { $isOpen: boolean }) =>
    $isOpen ? 'flex' : 'none'};
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: var(--surface-container-high);
  padding: 1.5rem;
  border-radius: 28px;
  max-width: 520px;
  width: calc(100% - 2rem);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: -0.5rem -0.5rem 0.5rem 0;

  h2 {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 500;
  }
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 1.5rem;
`;

export const TextForm: React.FC<TextFormProps> = function TextForm({
  onSubmit,
  loading,
}) {
  const [notification, notify] = useNotification(
    'Du må legge inn tekst før du kan generere en ordsky.',
    10,
  );

  const {
    state: { text, filter },
    actions: { updateText, clearText, updateFilter },
  } = useText();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const filterButtonRef = useRef<HTMLButtonElement>(null);

  const handleClickOutside = (event: MouseEvent | TouchEvent): void => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      setIsModalOpen(false);
    }
  };

  useEffect(() => {
    if (!isModalOpen) return;
    closeRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        setIsModalOpen(false);
        return;
      }
      if (event.key !== 'Tab' || !modalRef.current) return;
      // aria-modal does not stop Tab from reaching the page behind the modal.
      const focusable = [
        ...modalRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), input:not([disabled]), textarea:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
        ),
      ];
      const first = focusable.at(0);
      const last = focusable.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    const trigger = filterButtonRef.current;
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      trigger?.focus();
    };
  }, [isModalOpen]);

  useEffect(() => {
    if (isModalOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isModalOpen]);

  const onChange = ({ target }: ChangeEvent<HTMLTextAreaElement>): void => {
    updateText(target.value);
  };

  const handleSubmit = async (event: FormEvent): Promise<void> => {
    event.preventDefault();
    if (!text) {
      notify();
      return;
    }
    onSubmit(text, filter);
  };

  return (
    <>
      <Form onSubmit={handleSubmit}>
        <Textarea
          name="text"
          aria-label="Tekst"
          rows={5}
          placeholder="Lim inn tekst her"
          value={text}
          onChange={onChange}
        />
        <Toolbar>
          <Button
            ref={filterButtonRef}
            type="button"
            $variant="outlined"
            $small
            onClick={() => setIsModalOpen(true)}
          >
            <FontAwesomeIcon icon={faFilter} />
            {`Ignorerte ord (${filter.length})`}
          </Button>
          <Actions>
            <Button
              type="button"
              $variant="text"
              onClick={clearText}
              disabled={!text}
            >
              Tøm
            </Button>
            <Button type="submit" id="submit" disabled={loading}>
              Lag ordsky
            </Button>
          </Actions>
        </Toolbar>
        <Alert>{notification && notification}</Alert>
      </Form>
      <Details>
        <Summary>Hvordan fungerer ordsky genereringen?</Summary>
        <InfoText>
          Når du limer inn tekst, telles alle ordene i teksten. Størrelsen på
          hvert ord beregnes basert på hvor ofte det forekommer.
        </InfoText>
        <InfoText>
          Ordskyen dannes ved å plassere det mest betydningsfulle ordet i
          midten. Deretter plasseres de neste viktigste ordene rundt det. Hvis
          et ord overlapper med et annet, flyttes det forsiktig til en ledig
          plass. Denne prosessen fortsetter til alle ordene er plassert uten
          overlapping.
        </InfoText>
      </Details>
      <Modal $isOpen={isModalOpen}>
        <ModalContent
          ref={modalRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="filter-title"
        >
          <ModalHeader>
            <h2 id="filter-title">Ignorerte ord</h2>
            <IconButton
              ref={closeRef}
              type="button"
              aria-label="Lukk"
              onClick={() => setIsModalOpen(false)}
            >
              <FontAwesomeIcon icon={faXmark} size="lg" />
            </IconButton>
          </ModalHeader>
          <FilterManager filter={filter} setFilter={updateFilter} />
          <ModalActions>
            <Button
              type="button"
              $variant="text"
              onClick={() => setIsModalOpen(false)}
            >
              Ferdig
            </Button>
          </ModalActions>
        </ModalContent>
      </Modal>
    </>
  );
};
