<?php
namespace Uman;

require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/DoctrineBootstrap.php';

use Uman\Entity\User;
use Uman\Entity\Group;
use Symfony\Component\Debug\ErrorHandler;
use Symfony\Component\Debug\ExceptionHandler;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;

class UmanSilexApp
{
    public function run() {
        $app = $this->makeApplication();

        // Doctrine EntityManager
        $em = $app['em'];

        $app->get('/users/{login}', function ($login) use ($em, $app) {
            $user = $em->find('Uman\Entity\User', $login);
            return $app->json($user ? $user->serialize() : false);
        });

        $app->get('/users', function () use ($em, $app) {
            $users = $em->getRepository('Uman\Entity\User')->findAll();
            return $app->json($users ? User::serializeArray($users) : false);
        });

        // creates or replaces a user
        // POST content example: {"login": "some", "name": "Sebastian Ome", "groupIds": ["gr1", "gr2"] }
        // login is used as a unique key
        $app->post('/users', function (Request $request) use ($em, $app) {
            $serialized = json_decode($request->getContent(), true);
            $user = $em->getRepository('Uman\Entity\User')->persistSerialized($serialized);
            return $app->json($user->getId(), 201);
        });

        $app->delete('/users/{login}', function ($login) use ($em, $app) {
            $user = $em->getRepository('Uman\Entity\User')->find($login);
            if ($user) {
                $em->remove($user);
            }
            return $login;
        });

        $app->get('/groups', function () use ($em, $app) {
            $groupRepo = $em->getRepository('Uman\Entity\Group');
            return $app->json($groupRepo->getSummaryWithMemberCount());
            $groups = $em->getRepository('Uman\Entity\Group')->findAll();
            return $app->json($groups ? Group::serializeArray($groups) : false);
        });

        // creates a new groups
        // POST content example: {"name": "My New Group" }
        $app->post('/groups', function (Request $request) use ($em, $app) {
            $serialized = json_decode($request->getContent(), true);
            $group = $em->getRepository('Uman\Entity\Group')->find($serialized['name']);
            if ($group) {
                throw new \RuntimeException('group already exists: ' . $serialized['name']);
            } else {
                $group = Group::unserialize($serialized);
                $em->persist($group);
            }
            return $app->json($group->getId(), 201);
        });

        $app->delete('/groups/{id}', function ($id) use ($em, $app) {
            $group = $em->getRepository('Uman\Entity\Group')->find($id);
            if ($group) {
                $em->remove($group);
            }
            return $id;
        });

        $app->run();
    }

    /**
     * extract silex and (un)security setup,
     * which do not relate directly to the application
     *
     * @return \Silex\Application
     */
    private function makeApplication() {
        $app = new \Silex\Application();

        $app['debug'] = true;
        ErrorHandler::register();
        ExceptionHandler::register();
        Request::enableHttpMethodParameterOverride();

        $em = $app['em'] = DoctrineBootstrap::makeEntityManager();

        // allow DELETE with cross-origin
        $app->match("{url}", function($url) use ($app) {
            return new Response('', 200,
                array(
                    'Allow' => 'GET,POST,DELETE',
                    'Access-Control-Allow-Methods' => 'GET,POST,DELETE,OPTIONS,HEAD',
                    'Access-Control-Allow-Headers' => 'content-type'
                )
            );
        })->assert('url', '.*')->method("OPTIONS");

        $app->after(function (Request $request, Response $response) use ($em) {
            $em->flush();

            // allow cross-origin after the request was processed
            $response->headers->set('Access-Control-Allow-Origin', '*');
        });

        return $app;
    }
}

(new UmanSilexApp)->run();
