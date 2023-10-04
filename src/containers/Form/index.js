import React, { useCallback, useState } from "react";
import PropTypes from "prop-types";
import Field, { FIELD_TYPES } from "../../components/Field";
import Select from "../../components/Select";
import Button, { BUTTON_TYPES } from "../../components/Button";

const mockContactApi = () => new Promise((resolve) => {
  setTimeout(() => {
    resolve(); // Instead of returning a value, resolve the promise without any value
  }, 1000);
});

const Form = ({ onSuccess, onError }) => {
  const [sending, setSending] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  // Ajoutez un état local pour gérer les valeurs des champs du formulaire
  const [formValues, setFormValues] = useState({
    nom: "", // Valeur par défaut pour "Nom"
    prenom: "",   // Valeur par défaut pour "Prénom"
    email: "",    // Valeur par défaut pour "Email"
    message: "",  // Valeur par défaut pour "Message"
  });

  const sendContact = useCallback(
    async (evt) => {
      evt.preventDefault();
      setSending(true);
      
      // We try to call mockContactApi
      try {
        await mockContactApi();
        setSending(false);
        setShowConfirmation(true); // Affiche le message de confirmation
        onSuccess(); // Appelle la fonction onSuccess si nécessaire
        
        // Réinitialise les valeurs du formulaire à leurs valeurs par défaut
        setFormValues({
          nom: "",
          prenom: "",
          email: "",
          message: "",
        });
        // Réinitialise la clé resetKey pour réinitialiser le composant <Select>
        setResetKey(prevKey => prevKey + 1);
      } catch (err) {
        setSending(false);
        onError(err);
      }
    },
    [onSuccess, onError]
  );

  const handleInputChange = (name, value) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  return (
    <form onSubmit={sendContact}>
      <div className="row">
        <div className="col">
          <Field
            placeholder=""
            label="Nom"
            name="nom"
            value={formValues.nom}
            onChange={(e) => handleInputChange("nom", e.target.value)}
          />
          <Field
            placeholder=""
            label="Prénom"
            name="prenom"
            value={formValues.prenom}
            onChange={(e) => handleInputChange("prenom", e.target.value)}
          />
          <Select
            key={resetKey}
            selection={["Personel", "Entreprise"]}
            onChange={(value) => handleInputChange("type", value)}
            label="Personel / Entreprise"
            type="large"
            titleEmpty
          />
          <Field
            placeholder=""
            label="Email"
            name="email"
            value={formValues.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
          />
          <Button type={BUTTON_TYPES.SUBMIT} disabled={sending}>
            {sending ? "En cours" : "Envoyer"}
          </Button>
          {showConfirmation}
        </div>
        <div className="col">
          <Field
            placeholder="message"
            label="Message"
            name="message"
            type={FIELD_TYPES.TEXTAREA}
            value={formValues.message}
            onChange={(e) => handleInputChange("message", e.target.value)}
          />
        </div>
      </div>
    </form>
  );
};

Form.propTypes = {
  onError: PropTypes.func,
  onSuccess: PropTypes.func,
};

Form.defaultProps = {
  onError: () => null,
  onSuccess: () => null,
};

export default Form;
