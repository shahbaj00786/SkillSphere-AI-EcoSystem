const AvailabilitySection = ({
  availability = [],
  editMode,
  onChange,
}) => {

  const addAvailability = () => {

    onChange([
      ...availability,
      {
        date: "",
        startTime: "",
        endTime: "",
      },
    ]);
  };

  const updateAvailability = (
    index,
    field,
    value
  ) => {

    const updated = [...availability];

    updated[index] = {
      ...updated[index],
      [field]: value,
    };

    onChange(updated);
  };

  const removeAvailability = (
    index
  ) => {

    onChange(
      availability.filter(
        (_, i) => i !== index
      )
    );
  };

  return (
    <section className="profile-section">

      <div className="section-heading">

        <div className="section-title">

          <span className="section-icon">
            🕐
          </span>

          <h3>
            Availability
          </h3>

        </div>

      </div>

      {editMode ? (

        <div className="editor-box">

          {availability.map(
            (slot, index) => (

              <div
                className="availability-edit-row"
                key={index}
              >

                <input
                  type="date"
                  value={
                    slot.date || ""
                  }
                  onChange={(e) =>
                    updateAvailability(
                      index,
                      "date",
                      e.target.value
                    )
                  }
                />

                <input
                  type="time"
                  value={
                    slot.startTime || ""
                  }
                  onChange={(e) =>
                    updateAvailability(
                      index,
                      "startTime",
                      e.target.value
                    )
                  }
                />

                <input
                  type="time"
                  value={
                    slot.endTime || ""
                  }
                  onChange={(e) =>
                    updateAvailability(
                      index,
                      "endTime",
                      e.target.value
                    )
                  }
                />

                <button
                  type="button"
                  className="remove-btn"
                  onClick={() =>
                    removeAvailability(
                      index
                    )
                  }
                >
                  ✕
                </button>

              </div>
            )
          )}

          <button
            type="button"
            className="add-btn"
            onClick={addAvailability}
          >
            + Add Availability
          </button>

        </div>

      ) : (

        availability.length > 0 ? (

          <div className="availability-list">

            {availability.map(
              (slot, index) => (

                <div
                  className="availability-item"
                  key={index}
                >

                  <span>
                    {slot.date}
                  </span>

                  <strong>
                    {slot.startTime}
                    {" - "}
                    {slot.endTime}
                  </strong>

                </div>

              )
            )}

          </div>

        ) : (

          <div className="empty-state">
            No availability slots added yet.
          </div>

        )
      )}

    </section>
  );
};

export default AvailabilitySection;