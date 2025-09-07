// import React, { useState } from "react";
import "react-phone-input-2/lib/style.css";
import InfoBar from "../components/InfoBar";
import promoteCard from "../assets/promote-image.png";
import React, { useState, useContext } from "react";
import "../styles/Home.css";
import { DatePicker } from "@mantine/dates";
import "dayjs/locale/en";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import { DashboardContext } from "../components/DashboardContext";
import HoursActivityCard from "../components/HoursActivity";

export default function Home() {
  const { avatarUrl, currentUser } = useContext(DashboardContext);
  const [dob, setDob] = useState("");

  return (
    <div className="home-container">
      <div className="home-content">
        <div className="promote-card">
          <img src={promoteCard} alt="" />
          <a className="ai-navigate" href="#">
            <div className="button-container">
              <p>TRY NOW</p>
              <div className="go-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="44"
                  height="44"
                  viewBox="0 0 44 44"
                  fill="none"
                >
                  <path
                    d="M16.5 33L27.5 22L16.5 11"
                    stroke="black"
                    stroke-width="5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
            </div>
          </a>
        </div>
        <div className="skill-grid">
          <div className="skill">
            <div className="skill-info">
              <div className="skill-icon reading">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="50"
                  height="50"
                  viewBox="0 0 50 50"
                  fill="none"
                >
                  <path
                    d="M25 14.5833V43.75"
                    stroke="#EFEFEF"
                    stroke-width="4.16667"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M6.24984 37.5C5.6973 37.5 5.1674 37.2805 4.7767 36.8898C4.386 36.4991 4.1665 35.9692 4.1665 35.4167V8.33333C4.1665 7.7808 4.386 7.25089 4.7767 6.86019C5.1674 6.46949 5.6973 6.25 6.24984 6.25H16.6665C18.8766 6.25 20.9963 7.12797 22.5591 8.69078C24.1219 10.2536 24.9998 12.3732 24.9998 14.5833C24.9998 12.3732 25.8778 10.2536 27.4406 8.69078C29.0034 7.12797 31.123 6.25 33.3332 6.25H43.7498C44.3024 6.25 44.8323 6.46949 45.223 6.86019C45.6137 7.25089 45.8332 7.7808 45.8332 8.33333V35.4167C45.8332 35.9692 45.6137 36.4991 45.223 36.8898C44.8323 37.2805 44.3024 37.5 43.7498 37.5H31.2498C29.5922 37.5 28.0025 38.1585 26.8304 39.3306C25.6583 40.5027 24.9998 42.0924 24.9998 43.75C24.9998 42.0924 24.3414 40.5027 23.1693 39.3306C21.9972 38.1585 20.4074 37.5 18.7498 37.5H6.24984Z"
                    stroke="#EFEFEF"
                    stroke-width="4.16667"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
              <div className="skill-texts">
                <p className="skill-subtittle">Skill</p>
                <h2 className="skill-tittle">Reading</h2>
              </div>
            </div>
            <div className="skill-data">
              <div className="number-data">
                <div className="data total">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="33"
                    height="32"
                    viewBox="0 0 33 32"
                    fill="none"
                  >
                    <path
                      d="M20.4998 2.66669H12.4998C11.7635 2.66669 11.1665 3.26364 11.1665 4.00002V6.66669C11.1665 7.40307 11.7635 8.00002 12.4998 8.00002H20.4998C21.2362 8.00002 21.8332 7.40307 21.8332 6.66669V4.00002C21.8332 3.26364 21.2362 2.66669 20.4998 2.66669Z"
                      stroke="#343434"
                      stroke-width="2.66667"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M21.8335 5.33331H24.5002C25.2074 5.33331 25.8857 5.61426 26.3858 6.11436C26.8859 6.61446 27.1668 7.29274 27.1668 7.99998V26.6666C27.1668 27.3739 26.8859 28.0522 26.3858 28.5523C25.8857 29.0524 25.2074 29.3333 24.5002 29.3333H8.50016C7.79292 29.3333 7.11464 29.0524 6.61454 28.5523C6.11445 28.0522 5.8335 27.3739 5.8335 26.6666V7.99998C5.8335 7.29274 6.11445 6.61446 6.61454 6.11436C7.11464 5.61426 7.79292 5.33331 8.50016 5.33331H11.1668"
                      stroke="#343434"
                      stroke-width="2.66667"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                  <p>136</p>
                </div>
                <div className="data done">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="33"
                    height="32"
                    viewBox="0 0 33 32"
                    fill="none"
                  >
                    <path
                      d="M20.4998 2.66669H12.4998C11.7635 2.66669 11.1665 3.26364 11.1665 4.00002V6.66669C11.1665 7.40307 11.7635 8.00002 12.4998 8.00002H20.4998C21.2362 8.00002 21.8332 7.40307 21.8332 6.66669V4.00002C21.8332 3.26364 21.2362 2.66669 20.4998 2.66669Z"
                      stroke="#343434"
                      stroke-width="2.66667"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M21.8335 5.33331H24.5002C25.2074 5.33331 25.8857 5.61426 26.3858 6.11436C26.8859 6.61446 27.1668 7.29274 27.1668 7.99998V26.6666C27.1668 27.3739 26.8859 28.0522 26.3858 28.5523C25.8857 29.0524 25.2074 29.3333 24.5002 29.3333H8.50016C7.79292 29.3333 7.11464 29.0524 6.61454 28.5523C6.11445 28.0522 5.8335 27.3739 5.8335 26.6666V7.99998C5.8335 7.29274 6.11445 6.61446 6.61454 6.11436C7.11464 5.61426 7.79292 5.33331 8.50016 5.33331H11.1668"
                      stroke="#343434"
                      stroke-width="2.66667"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M12.5 18.6667L15.1667 21.3333L20.5 16"
                      stroke="#343434"
                      stroke-width="2.66667"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                  <p>35</p>
                </div>
              </div>
              <div className="progress-bar"></div>
            </div>
          </div>

          <div className="skill">
            <div className="skill-info">
              <div className="skill-icon listening">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="51"
                  height="50"
                  viewBox="0 0 51 50"
                  fill="none"
                >
                  <path
                    d="M6.75 29.1667H13C14.1051 29.1667 15.1649 29.6057 15.9463 30.3871C16.7277 31.1685 17.1667 32.2283 17.1667 33.3333V39.5833C17.1667 40.6884 16.7277 41.7482 15.9463 42.5296C15.1649 43.311 14.1051 43.75 13 43.75H10.9167C9.8116 43.75 8.75179 43.311 7.97039 42.5296C7.18899 41.7482 6.75 40.6884 6.75 39.5833V25C6.75 20.0272 8.72544 15.2581 12.2417 11.7417C15.7581 8.22544 20.5272 6.25 25.5 6.25C30.4728 6.25 35.2419 8.22544 38.7582 11.7417C42.2746 15.2581 44.25 20.0272 44.25 25V39.5833C44.25 40.6884 43.811 41.7482 43.0296 42.5296C42.2482 43.311 41.1884 43.75 40.0833 43.75H38C36.8949 43.75 35.8351 43.311 35.0537 42.5296C34.2723 41.7482 33.8333 40.6884 33.8333 39.5833V33.3333C33.8333 32.2283 34.2723 31.1685 35.0537 30.3871C35.8351 29.6057 36.8949 29.1667 38 29.1667H44.25"
                    stroke="#EFEFEF"
                    stroke-width="4.16667"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
              <div className="skill-texts">
                <p className="skill-subtittle">Skill</p>
                <h2 className="skill-tittle">Reeading</h2>
              </div>
            </div>
            <div className="skill-data">
              <div className="number-data">
                <div className="data total">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="33"
                    height="32"
                    viewBox="0 0 33 32"
                    fill="none"
                  >
                    <path
                      d="M20.4998 2.66669H12.4998C11.7635 2.66669 11.1665 3.26364 11.1665 4.00002V6.66669C11.1665 7.40307 11.7635 8.00002 12.4998 8.00002H20.4998C21.2362 8.00002 21.8332 7.40307 21.8332 6.66669V4.00002C21.8332 3.26364 21.2362 2.66669 20.4998 2.66669Z"
                      stroke="#343434"
                      stroke-width="2.66667"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M21.8335 5.33331H24.5002C25.2074 5.33331 25.8857 5.61426 26.3858 6.11436C26.8859 6.61446 27.1668 7.29274 27.1668 7.99998V26.6666C27.1668 27.3739 26.8859 28.0522 26.3858 28.5523C25.8857 29.0524 25.2074 29.3333 24.5002 29.3333H8.50016C7.79292 29.3333 7.11464 29.0524 6.61454 28.5523C6.11445 28.0522 5.8335 27.3739 5.8335 26.6666V7.99998C5.8335 7.29274 6.11445 6.61446 6.61454 6.11436C7.11464 5.61426 7.79292 5.33331 8.50016 5.33331H11.1668"
                      stroke="#343434"
                      stroke-width="2.66667"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                  <p>136</p>
                </div>
                <div className="data done">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="33"
                    height="32"
                    viewBox="0 0 33 32"
                    fill="none"
                  >
                    <path
                      d="M20.4998 2.66669H12.4998C11.7635 2.66669 11.1665 3.26364 11.1665 4.00002V6.66669C11.1665 7.40307 11.7635 8.00002 12.4998 8.00002H20.4998C21.2362 8.00002 21.8332 7.40307 21.8332 6.66669V4.00002C21.8332 3.26364 21.2362 2.66669 20.4998 2.66669Z"
                      stroke="#343434"
                      stroke-width="2.66667"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M21.8335 5.33331H24.5002C25.2074 5.33331 25.8857 5.61426 26.3858 6.11436C26.8859 6.61446 27.1668 7.29274 27.1668 7.99998V26.6666C27.1668 27.3739 26.8859 28.0522 26.3858 28.5523C25.8857 29.0524 25.2074 29.3333 24.5002 29.3333H8.50016C7.79292 29.3333 7.11464 29.0524 6.61454 28.5523C6.11445 28.0522 5.8335 27.3739 5.8335 26.6666V7.99998C5.8335 7.29274 6.11445 6.61446 6.61454 6.11436C7.11464 5.61426 7.79292 5.33331 8.50016 5.33331H11.1668"
                      stroke="#343434"
                      stroke-width="2.66667"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M12.5 18.6667L15.1667 21.3333L20.5 16"
                      stroke="#343434"
                      stroke-width="2.66667"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                  <p>35</p>
                </div>
              </div>
              <div className="progress-bar"></div>
            </div>
          </div>

          <div className="skill">
            <div className="skill-info">
              <div className="skill-icon writing">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="50"
                  height="50"
                  viewBox="0 0 50 50"
                  fill="none"
                >
                  <path
                    d="M27.0835 43.75H43.7502"
                    stroke="#EFEFEF"
                    stroke-width="4.16667"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M31.25 10.4167L39.5833 18.75"
                    stroke="#EFEFEF"
                    stroke-width="4.16667"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M44.1122 14.1917C45.2137 13.0905 45.8326 11.5968 45.8328 10.0393C45.833 8.48177 45.2144 6.98796 44.1132 5.88648C43.012 4.785 41.5184 4.16609 39.9609 4.16589C38.4033 4.1657 36.9095 4.78424 35.808 5.88544L8.00387 33.6959C7.52016 34.1781 7.16244 34.772 6.9622 35.425L4.21012 44.4917C4.15627 44.6719 4.15221 44.8633 4.19835 45.0455C4.24449 45.2278 4.33912 45.3943 4.47219 45.5271C4.60527 45.66 4.77183 45.7543 4.9542 45.8002C5.13657 45.846 5.32795 45.8417 5.50803 45.7875L14.5768 43.0375C15.2292 42.8391 15.823 42.4835 16.306 42.0021L44.1122 14.1917Z"
                    stroke="#EFEFEF"
                    stroke-width="4.16667"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
              <div className="skill-texts">
                <p className="skill-subtittle">Skill</p>
                <h2 className="skill-tittle">Reeading</h2>
              </div>
            </div>
            <div className="skill-data">
              <div className="number-data">
                <div className="data total">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="33"
                    height="32"
                    viewBox="0 0 33 32"
                    fill="none"
                  >
                    <path
                      d="M20.4998 2.66669H12.4998C11.7635 2.66669 11.1665 3.26364 11.1665 4.00002V6.66669C11.1665 7.40307 11.7635 8.00002 12.4998 8.00002H20.4998C21.2362 8.00002 21.8332 7.40307 21.8332 6.66669V4.00002C21.8332 3.26364 21.2362 2.66669 20.4998 2.66669Z"
                      stroke="#343434"
                      stroke-width="2.66667"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M21.8335 5.33331H24.5002C25.2074 5.33331 25.8857 5.61426 26.3858 6.11436C26.8859 6.61446 27.1668 7.29274 27.1668 7.99998V26.6666C27.1668 27.3739 26.8859 28.0522 26.3858 28.5523C25.8857 29.0524 25.2074 29.3333 24.5002 29.3333H8.50016C7.79292 29.3333 7.11464 29.0524 6.61454 28.5523C6.11445 28.0522 5.8335 27.3739 5.8335 26.6666V7.99998C5.8335 7.29274 6.11445 6.61446 6.61454 6.11436C7.11464 5.61426 7.79292 5.33331 8.50016 5.33331H11.1668"
                      stroke="#343434"
                      stroke-width="2.66667"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                  <p>136</p>
                </div>
                <div className="data done">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="33"
                    height="32"
                    viewBox="0 0 33 32"
                    fill="none"
                  >
                    <path
                      d="M20.4998 2.66669H12.4998C11.7635 2.66669 11.1665 3.26364 11.1665 4.00002V6.66669C11.1665 7.40307 11.7635 8.00002 12.4998 8.00002H20.4998C21.2362 8.00002 21.8332 7.40307 21.8332 6.66669V4.00002C21.8332 3.26364 21.2362 2.66669 20.4998 2.66669Z"
                      stroke="#343434"
                      stroke-width="2.66667"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M21.8335 5.33331H24.5002C25.2074 5.33331 25.8857 5.61426 26.3858 6.11436C26.8859 6.61446 27.1668 7.29274 27.1668 7.99998V26.6666C27.1668 27.3739 26.8859 28.0522 26.3858 28.5523C25.8857 29.0524 25.2074 29.3333 24.5002 29.3333H8.50016C7.79292 29.3333 7.11464 29.0524 6.61454 28.5523C6.11445 28.0522 5.8335 27.3739 5.8335 26.6666V7.99998C5.8335 7.29274 6.11445 6.61446 6.61454 6.11436C7.11464 5.61426 7.79292 5.33331 8.50016 5.33331H11.1668"
                      stroke="#343434"
                      stroke-width="2.66667"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M12.5 18.6667L15.1667 21.3333L20.5 16"
                      stroke="#343434"
                      stroke-width="2.66667"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                  <p>35</p>
                </div>
              </div>
              <div className="progress-bar"></div>
            </div>
          </div>
        </div>
        <div className="widget">
          <div className="hours-activity">
            <HoursActivityCard />
          </div>
          <div className="calendar">
            <DatePicker
              // defaultDate={dob}
              value={dob}
              onChange={setDob}
              // maxDate={new Date()}
              className="date-picker"
            />
          </div>
        </div>
      </div>
      <InfoBar FullName={currentUser.Fullname} avatarUrl={avatarUrl}></InfoBar>
    </div>
  );
}
