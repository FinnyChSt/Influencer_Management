import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { Form } from "react-router-dom";
import Button from "../../../shared/components/Button";
import TextInput from "../../../shared/components/TextInput";

interface SearchBarProps {
  onSearch: (firstName: string, lastName: string) => void;
  isLoading: boolean;
}

function SearchBar({ onSearch, isLoading }: SearchBarProps) {
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [showLoading, setShowLoading] = useState<boolean>(false);
  const [lastSearched, setLastSearched] = useState<{
    first: string;
    last: string;
  }>({ first: "", last: "" });

  useEffect(() => {
    const handler = setTimeout(() => {
      if (firstName !== lastSearched.first || lastName !== lastSearched.last) {
        onSearch(firstName, lastName);
        setLastSearched({ first: firstName, last: lastName });
      }
    }, 2000);

    return () => clearTimeout(handler);
  }, [firstName, lastName, lastSearched, onSearch]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    if (isLoading) {
      timer = setTimeout(() => {
        setShowLoading(true);
      }, 2000);
    } else {
      setShowLoading(false);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isLoading]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSearch(firstName, lastName);
    setLastSearched({ first: firstName, last: lastName });
  };

  const handleBlur = () => {
    if (firstName !== lastSearched.first || lastName !== lastSearched.last) {
      onSearch(firstName, lastName);
      setLastSearched({ first: firstName, last: lastName });
    }
  };

  return (
    <div className="mb-6 p-4 rounded-lg shadow-md bg-[#424242]">
      <Form
        onSubmit={handleSubmit}
        className="flex flex-wrap gap-4 items-end justify-start"
      >
        <div className="min-w-[200px] w-auto">
          <TextInput
            label="First Name"
            id="firstName"
            value={firstName}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setFirstName(e.target.value)
            }
            onBlur={handleBlur}
            placeholder="Enter first name"
          />
        </div>

        <div className="min-w-[200px] w-auto">
          <TextInput
            label="Last Name"
            id="lastName"
            value={lastName}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setLastName(e.target.value)
            }
            onBlur={handleBlur}
            placeholder="Enter last name"
          />
        </div>

        <div>
          <Button variant="primary" type="submit" disabled={isLoading}>
            {showLoading ? "Searching..." : "Search"}
          </Button>
        </div>
      </Form>
    </div>
  );
}

export default SearchBar;
