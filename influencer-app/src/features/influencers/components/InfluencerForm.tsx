import { XMarkIcon } from "@heroicons/react/24/solid";
import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import Button from "../../../shared/components/Button";
import TextInput from "../../../shared/components/TextInput";
import { SocialMediaTypes } from "../../../shared/types/models";
import { isValidName, MAX_NAME_LENGTH } from "../../../shared/utils/validation";
import NotificationToast from "../../notifications/components/NotificationToast";
import { addInfluencer, setModalOpen } from "../slice/Influencer.slice";
import { useNavigate } from "react-router-dom";

interface ValidationErrors {
  firstName?: string;
  lastName?: string;
  socialMedia?: string;
}

function InfluencerForm() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.influencers.isModalOpen);
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [instagram, setInstagram] = useState("");
  const [tiktok, setTiktok] = useState("");
  const [errors, setErrors] = useState<ValidationErrors>({});

  useEffect(() => {
    if (isOpen && dialogRef.current) {
      dialogRef.current?.showModal();
      document.body.classList.add("modal-open");
    } else if (dialogRef.current) {
      dialogRef.current?.close();
      document.body.classList.remove("modal-open");
    }
    if (!isOpen) {
      navigate("/list", { replace: true });
      setFirstName("");
      setLastName("");
      setInstagram("");
      setTiktok("");
      setErrors({});
    }
    return () => {
      document.body.classList.remove("modal-open");
    };
  }, [isOpen, navigate]);
  const handleDialogClose = () => {
    dispatch(setModalOpen(false));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let hasErrors = false;

    if (!firstName.trim()) {
      setErrors((prev) => ({
        ...prev,
        firstName: "First name is required",
      }));
      hasErrors = true;
    } else {
      const validNameResult = isValidName(firstName);
      if (validNameResult !== true) {
        setErrors((prev) => ({
          ...prev,
          firstName: `Please provide a valid First name: ${validNameResult}`,
        }));
        hasErrors = true;
      }
    }

    if (!lastName.trim()) {
      setErrors((prev) => ({
        ...prev,
        lastName: "Last name is required",
      }));
      hasErrors = true;
    } else {
      const validNameResult = isValidName(lastName);
      if (validNameResult !== true) {
        setErrors((prev) => ({
          ...prev,
          lastName: `Please provide a valid Last name: ${validNameResult}`,
        }));
        hasErrors = true;
      }
    }

    if (!instagram.trim() && !tiktok.trim()) {
      setErrors((prev) => ({
        ...prev,
        socialMedia: "Please insert at least one Social Media Account",
      }));
      hasErrors = true;
    }

    if (hasErrors) return;

    dispatch(
      addInfluencer({
        firstName: firstName,
        lastName: lastName,
        socialMedia: [
          {
            username: instagram,
            type: SocialMediaTypes.Instagram,
          },
          {
            username: tiktok,
            type: SocialMediaTypes.TikTok,
          },
        ],
      })
    );
  };

  if (!isOpen) return null;

  return (
    <dialog
      ref={dialogRef}
      onClose={handleDialogClose}
      className="bg-transparent p-0 max-w-md mx-auto rounded-lg overflow-visible backdrop:bg-grey backdrop:bg-opacity-50 backdrop:z-50"
    >
      <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
        <div className="bg-[#424242] rounded-lg shadow-xl p-6 w-full max-w-md pointer-events-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-x2 font-extrabold uppercase text-[#EBFF08]">
              Create New Influencer
            </h2>
            <Button
              variant="tertiary"
              type="button"
              onClick={handleDialogClose}
              className="p-0 px-0 h-8 w-8 flex items-center justify-center rounded-full"
            >
              <XMarkIcon className="h-5 w-5" />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-neutral-700">
            <div>
              <TextInput
                label={"First Name"}
                id={"firstName"}
                value={firstName}
                onChange={(e) => {
                  setFirstName(e.target.value);
                  const validNameResult = isValidName(e.target.value);
                  if (validNameResult !== true) {
                    setErrors((prev) => ({
                      ...prev,
                      firstName: `Please provide a valid First name: ${validNameResult}`,
                    }));
                  } else {
                    setErrors((prev) => {
                      const newErrors = { ...prev };
                      delete newErrors.firstName;
                      return newErrors;
                    });
                  }
                }}
                placeholder="Enter First name"
                required={true}
              />
              {errors.firstName ? (
                <p className="flex mt-1 text-sm text-red-600">
                  {errors.firstName}
                </p>
              ) : (
                <p className="flex mt-1 text-xs text-white">
                  Max {MAX_NAME_LENGTH} characters
                </p>
              )}
            </div>

            <div>
              <TextInput
                label="Last Name"
                id="lastName"
                value={lastName}
                onChange={(e) => {
                  setLastName(e.target.value);
                  const validNameResult = isValidName(e.target.value);
                  if (validNameResult !== true) {
                    setErrors((prev) => ({
                      ...prev,
                      lastName: `Please provide a valid Last name: ${validNameResult}`,
                    }));
                  } else {
                    setErrors((prev) => {
                      const newErrors = { ...prev };
                      delete newErrors.lastName;
                      return newErrors;
                    });
                  }
                }}
                placeholder="Enter Last name"
                required={true}
              />
              {errors.lastName ? (
                <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
              ) : (
                <p className="flex mt-1 text-xs text-white">
                  Max {MAX_NAME_LENGTH} characters
                </p>
              )}
            </div>

            <div>
              <TextInput
                label="Instagram"
                id="instagram"
                value={instagram}
                onChange={(e) => {
                  setInstagram(e.target.value);
                  if (e.target.value.trim() || tiktok.trim()) {
                    setErrors((prev) => {
                      const newErrors = { ...prev };
                      delete newErrors.socialMedia;
                      return newErrors;
                    });
                  }
                }}
                placeholder="Instagram username"
                required={false}
              />
            </div>
            <div>
              <TextInput
                label="TikTok"
                id="tiktok"
                value={tiktok}
                onChange={(e) => {
                  setTiktok(e.target.value);
                  if (e.target.value.trim() || instagram.trim()) {
                    setErrors((prev) => {
                      const newErrors = { ...prev };
                      delete newErrors.socialMedia;
                      return newErrors;
                    });
                  }
                }}
                placeholder="TikTok username"
                required={false}
              />
            </div>
            {errors.socialMedia && (
              <p className="text-sm text-red-600">{errors.socialMedia}</p>
            )}
            <div className="flex justify-end pt-4">
              <Button
                variant="secondary"
                type="button"
                onClick={handleDialogClose}
                children={"Cancel"}
              />
              <Button variant="primary" type="submit" children={"Create"} />
            </div>
          </form>
        </div>
      </div>
      <NotificationToast />
    </dialog>
  );
}

export default InfluencerForm;
