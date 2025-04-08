import React, { useState } from 'react';
import styles from './Registration.module.scss';
import { checkAuth } from '../../functions/checkAuth.ts';

interface Props {
  onSubmit: (v: boolean) => void;
  onLoading: (v: boolean) => void;
}

export const Registration: React.FC<Props> = ({ onSubmit, onLoading }) => {
  const [name, setName] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (name) {
      localStorage.setItem('name', name);
      checkAuth(onSubmit, onLoading);
    }
  };
  return (
    <form className={styles.form} onSubmit={(event) => handleSubmit(event)}>
      <h3 className={styles.formTitle}>Enter your name</h3>
      <input
        className={styles.nameInput}
        type="text"
        value={name ?? ''}
        placeholder="Enter your name"
        onChange={(e) => {
          setName(e.target.value);
        }}
      />
      <button className={styles.submitButton} type="submit">
        Login
      </button>
    </form>
  );
};
