import React, { useEffect, useState } from "react";
import apiCall from "../service/apiCall";

export default function MainPage() {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setperPage] = useState(10);
  const [accordionToggle, setAccordionToggle] = useState(false);
  useEffect(async () => {
    if (searchTerm) {
      await apiCall(
        `https://powerful-headland-42387.herokuapp.com/searchimage?page=${page}&per_page=${perPage}&search=${searchTerm}`
      )
        .then((response) => {
          setData(response.data.results);
        })
        .catch((error) => {
          console.log("Error is ", error.data);
        });
    } else {
      await apiCall(
        `https://powerful-headland-42387.herokuapp.com/searchimage?page=${page}&per_page=${perPage}`
      )
        .then((response) => {
          setData(response.data);
        })
        .catch((error) => {
          console.log("Error is ", error.data);
        });
    }
  }, [page, perPage]);

  function onChangeHandler(e) {
    setSearchTerm(e.target.value);
  }

  async function blankSearchPageOne() {
    await apiCall(
      `https://powerful-headland-42387.herokuapp.com/searchimage?page=${page}&per_page=${perPage}`
    )
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.log("Error is ", error.data);
      });
  }

  async function onSearch() {
    if (searchTerm === "") {
      if (page > 1) {
        setData([]);
        setPage(1);
      }
      else blankSearchPageOne();
    } else {
      setData([]);
      await apiCall(
        `https://powerful-headland-42387.herokuapp.com/searchimage?page=${page}&per_page=10&search=${searchTerm}`
      )
        .then((response) => {
          setData(response.data.results);
        })
        .catch((error) => {
          console.log("Error is ", error.data);
        });
    }
  }

  function onSubmitHandler(e) {
    e.preventDefault();
    const { name, value } = e.target;
    if (name === "next") {
      setData([]);
      let currentPage = page;
      setPage((currentPage = currentPage + 1));
    } else if (name === "previous") {
      if (page <= 1) {
        alert("You are on the first page");
        setPage(1);
      } else {
        let currentPage = page;
        setPage((currentPage = currentPage - 1));
      }
    } else if (name === "accordion") {
      setAccordionToggle(value);
      if (accordionToggle === value) {
        setAccordionToggle(false);
      }
    } else {
      if (page > 1) setPage(1);
      else {
        onSearch();
      }
    }
  }

  function dropDownHelper(e) {
    e.preventDefault();
    const { value } = e.target.attributes;
    setperPage(value.nodeValue);
  }

  function options() {
    let content = [];
    for (let i = 10; i <= 30; i = i + 10) {
      content.push(
        <li key={i}>
          <a
            className={
              parseInt(perPage) === i ? "dropdown-item active" : "dropdown-item"
            }
            value={i}
            onClick={dropDownHelper}
          >
            {i}
          </a>
        </li>
      );
    }
    return content;
  }

  return (
    <>
      <form
        onSubmit={onSubmitHandler}
        className="position-sticky top-0 bg-light mb-3 topbar-form"
      >
        <div className="row">
          <div className="col-sm-12 col-md-10">
            <input
              type="text"
              className="form-control"
              id="exampleFormControlInput1"
              placeholder="Search here..."
              onChange={onChangeHandler}
            />
          </div>
          <div className="col-sm-12 col-md-2">
            <button
              type="submit"
              className="btn btn-primary mb-3 search-button"
            >
              Search
            </button>
          </div>
        </div>
        <div className="row">
          <div className="dropdown col-sm-12 col-md-12 col-lg-12">
            <label className="form-label me-2">Images per page</label>
            <button
              className="btn btn-primary dropdown-toggle"
              type="button"
              id="dropdownMenuButton1"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              {perPage}
            </button>
            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
              {options()}
            </ul>
          </div>
        </div>
      </form>
      <div className="row">
        {data.length > 0 ? (
          data.map((item) => (
            <div key={item.id} className="col-sm-12 col-md-4 img-column">
              <img
                className="img-fluid img-class w-100"
                alt={item.alt_description}
                src={item.urls.small}
              />
              <div className="download-button-div">
                <a
                  href={`https://unsplash.com/photos/${item.id}/download?force=true`}
                  className="btn btn-outline-dark download-button"
                >
                  Download
                </a>
              </div>
              <div className="accordion" id="accordionExample">
                <div className="accordion-item">
                  <h2 className="accordion-header" id="headingOne">
                    <button
                      className="accordion-button accordion-button-arrow"
                      type="button"
                      aria-expanded={accordionToggle === item.id ? true : false}
                      value={item.id}
                      name="accordion"
                      onClick={onSubmitHandler}
                    >
                      {item.user.name ? item.user.name : "User Info"}
                    </button>
                  </h2>
                  <div
                    id="collapseOne"
                    className={
                      accordionToggle === item.id
                        ? "accordion-collapse collapse show"
                        : "accordion-collapse collapse"
                    }
                    aria-labelledby="headingOne"
                    data-bs-parent="#accordionExample"
                  >
                    {item.user.bio ? (
                      <div className="accordion-body">
                        <div>
                          <strong>Bio: </strong>
                          {item.user.bio}
                        </div>
                        {item.user.total_likes ? (
                          <div>
                            <strong>Total Likes: </strong>
                            {item.user.total_likes}
                          </div>
                        ) : null}
                        {item.user.total_photos ? (
                          <div>
                            <strong>Total Photos: </strong>
                            {item.user.total_photos}
                          </div>
                        ) : null}
                        <hr />
                        <div className="social-network-profiles">
                          {item.user.location ? (
                            <div>
                              <strong>Location: </strong>
                              {item.user.location}
                            </div>
                          ) : null}
                          {item.user.instagram_username ? (
                            <div>
                              <strong>Instagram: </strong>
                              {item.user.instagram_username}
                            </div>
                          ) : null}
                          {item.user.twitter_username ? (
                            <div>
                              <strong>Twitter: </strong>
                              {item.user.twitter_username}
                            </div>
                          ) : null}
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div>Loading...</div>
        )}
      </div>
      <div className="navigation-button d-flex justify-content-between">
        <div>
          <button
            onClick={onSubmitHandler}
            name="previous"
            className="btn btn-outline-primary"
          >
            Previous
          </button>
        </div>
        <div className="justify-content-center">{page}</div>
        <div>
          <button
            onClick={onSubmitHandler}
            name="next"
            className="btn btn-outline-primary"
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
}
