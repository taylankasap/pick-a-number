<?php

namespace AppBundle\Controller;

use AppBundle\Entity\Choice;
use AppBundle\Form\NumberChoiceType;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

class DefaultController extends Controller
{
    /**
     * @Route("/", name="homepage")
     * @Template("default/index.html.twig")
     */
    public function indexAction(Request $request)
    {
        $em = $this->getDoctrine()->getManager();

        $valueCounts = $em->getRepository(Choice::class)->findValueCounts();

        return array(
            'valueCounts' => $valueCounts,
        );
    }

    /**
     * @Route("/pick-a-number-modal", name="pick_a_number_modal")
     * @Template("default/modal.html.twig")
     */
    public function modalAction(Request $request)
    {
        $choice = new Choice();

        $form = $this->createForm(NumberChoiceType::class, $choice, array(
                'action' => $this->generateUrl('pick_a_number_modal'),
            ));

        $form->handleRequest($request);

        if ($form->isSubmitted()) {
            if ($form->isValid()) {
                $em = $this->getDoctrine()->getManager();
                $em->persist($choice);
                $em->flush();
            } else {
                foreach ($form->getErrors(true) as $error) {
                    $this->addFlash('error', $error->getMessage());
                }
            }

            return $this->redirectToRoute('homepage');
        }

        return array(
            'form' => $form->createView(),
        );
    }
    /**
     * @Route("/value-counts", name="value_counts")
     */
    public function valueCountsAction()
    {
        $em = $this->getDoctrine()->getManager();

        $valueCounts = $em->getRepository(Choice::class)->findValueCounts();

        $data = array_map(function($value, $count) {
            return array(
                'value' => $value,
                'count' => $count,
            );
        }, array_keys($valueCounts), $valueCounts);

        return new JsonResponse($data);
    }
}
