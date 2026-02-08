import { Loader } from '../Loader/Loader';
import { Person } from '../../types';
import { useEffect, useState } from 'react';
import { getPeople } from '../../api';
import { PersonLink } from '../PersonLink/personLink';
import '../../App.scss';

export const People = () => {
  const [people, setPeople] = useState<Person[] | null>(null);
  const [loading, setLoading] = useState(false);

  const [, setPeopleLoadingError] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');

  const [selectedPersonSlug, setSelectedPersonSlug] = useState('');

  useEffect(() => {
    setErrorMessage('');
    setLoading(true);
    getPeople()
      .then(setPeople)
      .catch(() => {
        setErrorMessage('Something went wrong');
        setPeopleLoadingError(true);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <h1 className="title">People Page</h1>
      <div className="block">
        <div className="box table-container">
          {loading && <Loader />}

          {errorMessage && (
            <p data-cy="peopleLoadingError" className="has-text-danger">
              {errorMessage}
            </p>
          )}
          {!loading && people && people.length === 0 && (
            <p data-cy="noPeopleMessage">There are no people on the server</p>
          )}

          {people && people.length > 0 && (
            <table
              data-cy="peopleTable"
              className="table is-striped is-hoverable is-narrow is-fullwidth"
            >
              {!loading && (
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Sex</th>
                    <th>Born</th>
                    <th>Died</th>
                    <th>Mother</th>
                    <th>Father</th>
                  </tr>
                </thead>
              )}
              <tbody>
                {people?.map(person => {
                  const mother = people.find(p => p.name === person.motherName);
                  const father = people.find(p => p.name === person.fatherName);

                  return (
                    <tr
                      key={person.slug}
                      className={
                        selectedPersonSlug === person.slug
                          ? 'has-background-warning'
                          : ''
                      }
                      onClick={() => setSelectedPersonSlug(person.slug)}
                    >
                      <td data-cy="person">
                        <PersonLink person={person} />
                      </td>

                      <td>{person.sex}</td>
                      <td>{person.born}</td>
                      <td>{person.died}</td>
                      <td>
                        {person.motherName ? (
                          mother ? (
                            <PersonLink person={mother} />
                          ) : (
                            person.motherName
                          )
                        ) : (
                          '-'
                        )}
                      </td>
                      <td>
                        {person.fatherName ? (
                          father ? (
                            <PersonLink person={father} />
                          ) : (
                            person.fatherName
                          )
                        ) : (
                          '-'
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
};
