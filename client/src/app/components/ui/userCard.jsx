import React, { useState } from "react";
import PropTypes from "prop-types";
import { useHistory } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getCurrentUserData, updateRateUser } from "../../store/users";
import { decrementItem, incrementItem } from "../../utils/calculateData";
const UserCard = ({ user }) => {
    const history = useHistory();
    const { userId } = useParams();
    console.log("userId", userId);

    const currentUser = useSelector(getCurrentUserData());
    const [userRate, setUserRate] = useState(user.rate);
    const [carets, setCarets] = useState({
        up: false,
        down: false
    });
    const [disabled, setDisabled] = useState(false);
    const dispatch = useDispatch();

    const getClassUpCaret = () => {
        return "bi bi-caret-up" + (carets.up ? "-fill" : "") + " text-primary";
    };

    const getClassDownCaret = () => {
        return "bi bi-caret-down" + (carets.down ? "-fill" : "") + " text-primary";
    };

    const handleRateClick = (direction) => {
        if (direction === "down") {
            setCarets({
                down: true,
                up: false
            });
            const newRate = decrementItem(userRate);
            setUserRate(newRate);
            dispatch(updateRateUser({ rate: newRate, _id: userId }));
            // disable all carets-buttons
            setDisabled(true);
        } else if (direction === "up") {
            setCarets({
                down: false,
                up: true
            });
            const newRate = incrementItem(userRate);
            setUserRate(newRate);
            dispatch(updateRateUser({ rate: newRate, _id: userId }));
            // disable all carets-buttons
            setDisabled(true);
        }
    };

    const handleClick = () => {
        history.push(history.location.pathname + "/edit");
    };
    console.log("disabled", disabled);
    return (
        <div className="card mb-3">
            <div className="card-body">
                {currentUser._id === user._id && (
                    <button
                        className="position-absolute top-0 end-0 btn btn-light btn-sm"
                        onClick={handleClick}
                    >
                        <i className="bi bi-gear"></i>
                    </button>
                )}

                <div className="d-flex flex-column align-items-center text-center position-relative">
                    <img
                        src={user.image}
                        className="rounded-circle"
                        width="150"
                    />
                    <div className="mt-3">
                        <h4>{user.name}</h4>
                        <p className="text-secondary mb-1">
                            {user.profession.name}
                        </p>
                        <div className="text-muted">
                            <i
                                onClick={() => handleRateClick("down")}
                                className={getClassDownCaret()}
                                role="button"
                                disabled={disabled}
                            ></i>
                            <i
                                onClick={() => handleRateClick("up")}
                                className={getClassUpCaret()}
                                role="button"
                                disabled={disabled}
                            ></i>
                            <span className="ms-2">{userRate}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
UserCard.propTypes = {
    user: PropTypes.object
};

export default UserCard;
