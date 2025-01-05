import React, {
  FormEvent,
  ChangeEvent,
  useEffect,
  useState,
  useRef,
} from 'react';
import { Button, SecondaryButton } from '../../common/atoms/Button';
import { Container } from '../../common/atoms/Container';
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
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';

export type TextFormProps = {
  onSubmit: (text: string, filter: string[]) => void;
  loading: boolean;
};

const Form = styled(FormBase)`
  gap: 1rem;
`;

const FilterButton = styled.button`
  background: none;
  border: none;
  color: var(--text-color-primary);
  cursor: pointer;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  &:hover {
    color: var(--primary-color-light);
  }
`;

const Modal = styled.div<{ $isOpen: boolean }>`
  display: ${({ $isOpen }: { $isOpen: boolean }) =>
    $isOpen ? 'flex' : 'none'};
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: #424242;
  padding: 2rem;
  border-radius: 8px;
  max-width: 500px;
  width: 90%;
  position: relative;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: var(--text-color-primary);
  cursor: pointer;
  font-size: 2rem;
  position: absolute;
  top: 1rem;
  right: 1rem;
  &:hover {
    color: var(--primary-color-light);
  }
`;

export const TextForm: React.FC<TextFormProps> = function TextForm({
  onSubmit,
  loading,
}) {
  const [notification, notify] = useNotification(
    'Du må legge inn tekst før du kan generere en ordsky.',
    10
  );

  const {
    state: { text, filter },
    actions: { updateText, clearText, updateFilter },
  } = useText();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent | TouchEvent): void => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      setIsModalOpen(false);
    }
  };

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
          rows={5}
          placeholder="Lim inn tekst her"
          value={text}
          onChange={onChange}
        />
        <FilterButton type="button" onClick={() => setIsModalOpen(true)}>
          <FontAwesomeIcon icon={faFilter} />
          Ignorer ord
        </FilterButton>
        <Container>
          <SecondaryButton type="button" onClick={clearText}>
            Tøm
          </SecondaryButton>
          <Button type="submit" id="submit" disabled={loading}>
            Generer ordsky
          </Button>
        </Container>
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
        <ModalContent ref={modalRef}>
          <CloseButton onClick={() => setIsModalOpen(false)}>
            &times;
          </CloseButton>
          <FilterManager filter={filter} setFilter={updateFilter} />
        </ModalContent>
      </Modal>
    </>
  );
};
